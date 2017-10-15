import {curry, reduce, mergeAll, concat, has, identity} from "lodash/fp";
import Promise from "bluebird";
import tika from "tika";
import moment from "moment";

import ct from "./content-types";

const contentTypes = {
  "image/jpeg": ct.imageJpeg,
  "application/pdf": ct.applicationPdf,
};

export const extract = unit =>
  // eslint-disable-next-line promise/avoid-new
  new Promise((resolve, reject) =>
    tika.extract(unit.path, (err, text, meta) => {
      if (err) return reject(err);
      return resolve([text, meta]);
    })
  );

export const entity = curry((unit, text, meta) => {
  const created = moment(meta.date)
    .utc()
    .toDate();

  const idFields = reduce(
    (memo, f) => {
      if (has(f, meta)) {
        return concat(memo, f);
      }
      return memo;
    },
    unit._sc_id_fields || [],
    ["Content-Type"]
  );

  const contentFields = reduce(
    (memo, f) => {
      if (has(f, meta)) {
        return concat(memo, f);
      }
      return memo;
    },
    unit._sc_content_fields || [],
    ["title"]
  );

  const contentType = has(meta["Content-Type"], contentTypes)
    ? contentTypes[meta["Content-Type"]]
    : identity;

  return contentType(
    mergeAll([
      unit,
      meta,
      {text},
      {
        _sc_pubdates: {tika: created},
        _sc_id_fields: idFields,
        _sc_content_fields: contentFields,
      },
    ])
  );
});

export default {
  extract,
  entity,
};