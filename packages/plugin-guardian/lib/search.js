import {curry, merge, property, size} from "lodash/fp";
import {flowP, flatmapP, collectP, tapP} from "dashp";
import request from "request";
import pify from "pify";
import moment from "moment";
import {envelope as env, plugin as p} from "@sugarcube/core";

import {assertKey} from "./utils";

const getAsync = pify(request.get);

const searchGuardian = curry((key, term) => {
  const opts = {
    uri: "https://content.guardianapis.com/search",
    qs: {"api-key": key, q: term},
    json: true,
  };

  return getAsync(opts).then(property("body.response.results"));
});

const content = (envelope, {log, cfg}) => {
  const {key} = cfg.guardian;
  const queries = env.queriesByType("guardian_search", envelope);

  const search = term =>
    flowP(
      [
        searchGuardian(key),
        tapP(rs =>
          log.info(`Fetched ${size(rs)} pieces of content for ${term}.`),
        ),
      ],
      term,
    );

  return flowP(
    [
      flatmapP(search),
      collectP(r => {
        const unit = {
          _sc_source: "guardian_content",
          _sc_id_fields: ["id"],
          _sc_content_fields: ["webTitle", "webUrl"],
          _sc_pubdates: {source: moment.utc(r.webPublicationDate).toDate()},
          _sc_relations: [
            {type: "url", term: r.webUrl},
            {type: "url", term: r.apiUrl},
          ],
          _sc_media: [
            {type: "url", term: r.webUrl},
            {type: "json", term: r.apiUrl},
          ],
        };
        return merge(r, unit);
      }),
      rs => env.concatData(rs, envelope),
    ],
    queries,
  );
};

const plugin = p.liftManyA2([assertKey, content]);

plugin.desc = "Search for content of The Guardian.";

export default plugin;
