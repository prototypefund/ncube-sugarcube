import {utils} from "@sugarcube/core";

const {assertCfg} = utils.assertions;

export const assertCredentials = assertCfg([
  "google.client_id",
  "google.project_id",
  "google.client_secret",
]);

export const assertSpreadsheet = assertCfg(["google.spreadsheet_id"]);

export default {assertCredentials, assertSpreadsheet};