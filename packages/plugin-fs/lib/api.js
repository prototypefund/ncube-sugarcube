import fs from "fs";
import {promisify} from "util";
import {flowP, collectP} from "dashp";
import crypto from "crypto";
import {dirname} from "path";
import glob from "glob";

export const accessP = promisify(fs.access);
export const unlinkP = promisify(fs.unlink);
export const cpP = promisify(fs.copyFile);

export const existsP = async location => {
  try {
    await accessP(location);
  } catch (e) {
    if (e.code === "ENOENT") return false;
    throw e;
  }
  return true;
};

export const mkdirP = dir =>
  promisify(fs.mkdir)(dir).catch(err => {
    switch (err.code) {
      case "EEXIST":
        return Promise.resolve();
      case "ENOENT":
        // eslint-disable-next-line promise/no-nesting
        return mkdirP(dirname(dir)).then(() => mkdirP(dir));
      default:
        throw err;
    }
  });

const hashFile = algorithm => target => {
  const fd = fs.createReadStream(target);
  const hash = crypto.createHash(algorithm);
  hash.setEncoding("hex");

  // eslint-disable-next-line promise/avoid-new
  return new Promise((resolve, reject) => {
    fd.on("end", () => {
      hash.end();
      resolve(hash.read());
    });
    fd.on("error", reject);

    fd.pipe(hash);
  });
};

export const sha256sum = hashFile("sha256");
export const md5sum = hashFile("md5");

/**
 * Unfold a glob pattern into a list of file objects.
 *
 * `unfold :: String -> Future [a]`
 *
 * @param {string} pattern A glob file pattern.
 * @returns {Promise.<Array.<Object>>} A list of file objects. Contains
 * location, sha256 and md5 sums.
 */
export const unfold = flowP([
  pattern => promisify(glob)(...[pattern, {nodir: true}]),
  collectP(location =>
    Promise.all([sha256sum(location), md5sum(location)]).then(
      ([sha256, md5]) => ({
        location,
        sha256,
        md5,
        _sc_id_fields: ["location"],
        _sc_content_fields: ["sha256", "md5"],
      }),
    ),
  ),
]);
