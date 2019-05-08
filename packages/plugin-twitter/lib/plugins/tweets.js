import {chunk} from "lodash/fp";
import {flowP, caughtP, flatmapP} from "dashp";
import {envelope as env, plugin as p} from "@sugarcube/core";

import {tweets, parseApiErrors} from "../twitter";
import {tweetTransform} from "../entities";
import {parseTweetId} from "../utils";
import {assertCredentials} from "../assertions";

const querySource = "twitter_tweet";

const tweetsPlugin = async (envelope, {log, cfg, stats}) => {
  const tweetIds = env
    .queriesByType(querySource, envelope)
    .map(term => parseTweetId(term));

  log.info(`Querying Twitter for ${tweetIds.length} tweets.`);

  const fetchTweets = ids => {
    log.info(`Fetching a chunk of ${ids.length} tweets.`);
    return flowP(
      [
        // Fetch tweets for this chunk.
        tweets(cfg),
        // Verify each tweet was retrieved and exists.
        ({id: response}) => {
          const results = [];
          const fails = [];
          // Verify the response and bail otherwise.
          if (response == null) {
            ids.forEach(id => {
              fails.push({
                type: querySource,
                term: id,
                plugin: "twitter_tweet",
                reason: "No tweets fetched.",
              });
            });
            return [results, fails];
          }

          Object.keys(response).forEach(id => {
            if (response[id] == null) {
              fails.push({
                type: querySource,
                term: id,
                plugin: "twitter_tweet",
                reason: "Tweet does not exist.",
              });
            } else {
              results.push(response[id]);
            }
          });

          return [tweetTransform(results), fails];
        },
        // Handle any failed tweets.
        ([results, fails]) => {
          if (fails.length > 0) {
            stats.update(
              "failed",
              failed =>
                Array.isArray(failed) ? failed.concat(fails) : [fails],
            );
            fails.forEach(({term, reason}) =>
              log.warn(`Failed to fetch tweet ${term}: ${reason}`),
            );
          }
          return results;
        },
        // Merge the query into the data unit.
        results =>
          results.map(r => {
            const query = envelope.queries.find(
              ({type, term}) =>
                type === querySource && parseTweetId(term) === r.tweet_id,
            );
            if (query == null) return r;
            return Object.assign(r, {
              _sc_queries: Array.isArray(r._sc_queries)
                ? r._sc_queries.concat(query)
                : [query],
            });
          }),
        // Handle any API errors.
        caughtP(e => {
          const reason = parseApiErrors(e);
          ids.forEach(id => {
            const fail = {
              type: querySource,
              term: id,
              plugin: "twitter_tweet",
              reason,
            };
            stats.update(
              "failed",
              queries =>
                Array.isArray(queries) ? queries.concat(fail) : [fail],
            );
            log.warn(`Failed to fetch tweet ${id}: ${reason}`);
          });
          return [];
        }),
      ],
      ids,
    );
  };

  const results = await flatmapP(fetchTweets, chunk(50, tweetIds));

  log.info(`Fetched ${results.length} out of ${tweetIds.length} tweets.`);

  return env.concatData(results, envelope);
};

const plugin = p.liftManyA2([assertCredentials, tweetsPlugin]);

plugin.desc = "Fetch individual tweets";
plugin.argv = {};

export default plugin;