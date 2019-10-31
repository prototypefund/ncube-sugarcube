import exifPlugin from "./plugins/exif";
import youtubedlPlugin from "./plugins/youtubedl";
import youtubedlCheckPlugin from "./plugins/youtubedl-check";
import mosaicPlugin from "./plugins/mosaic";
import fileImportPlugin from "./plugins/file_import";
import warcPlugin from "./plugins/warc";
import screenshotPlugin from "./plugins/screenshot";

const plugins = {
  media_exif: exifPlugin,
  media_youtubedl: youtubedlPlugin,
  media_youtubedl_check: youtubedlCheckPlugin,
  media_mosaic: mosaicPlugin,
  media_file_import: fileImportPlugin,
  media_warc: warcPlugin,
  media_screenshot: screenshotPlugin,
};

export {plugins};
export default {plugins};
