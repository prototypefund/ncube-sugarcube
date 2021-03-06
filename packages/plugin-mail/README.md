# `@sugarcube/plugin-mail`

Plugins for SugarCube ...

## Installation

```shell
npm install --save @sugarcube/plugin-mail
```

## Plugins

### `mail_failed_stats`

This plugin emails any failed queries that occur during a pipeline run. It looks up the list of queries in the `failed` attribute of the stats object. It will send an email to qvery recipient supplied using the `mail_recipient` query type. If there are no failed queries, the email sending will be skipped.

**Configuration**:

Uses `mail_recipient` as query type.

- `mail.debug`

  Turn on debug mode. In this mode mails are not actually sent, but only
  logged to the screen.

- `mail.no-encrypt`

  Disable the gpg encryption for this run. Emails will be send in clear text. Every email is encrypted using gpg before sending. The `gpg` binary must be installed and the recipient's public key imported into the users keyring and be trusted. The email won't send if the encryption fails.

  **FIXME**: Not tested on Windows, how would it work there with the `gpg` binary?

- `mail.from`

  Set this email address as sender in the `From:` header.

- `mail.smtp_user`

  Configure the user account for the SMTP server in use.

- `mail.smtp_password`

  Configure the password for the SMTP server in use.

- `mail.smtp_host`

  Configure the host name of the SMTP server in use.

- `mail.smtp_port`

  Configure the port of the SMTP server in use.

### `mail_pipeline_stats`

A pipeline run collects a lot of instrumentation details during a run. This plugin creates a run report and emails it. It will send an email to qvery recipient supplied using the `mail_recipient` query type.

**Configuration**:

Uses `mail_recipient` as query type.

- `mail.debug`

  Turn on debug mode. In this mode mails are not actually sent, but only
  logged to the screen.

- `mail.no-encrypt`

  Disable the gpg encryption for this run. Emails will be send in clear text. Every email is encrypted using gpg before sending. The `gpg` binary must be installed and the recipient's public key imported into the users keyring and be trusted. The email won't send if the encryption fails.

  **FIXME**: Not tested on Windows, how would it work there with the `gpg` binary?

- `mail.from`

  Set this email address as sender in the `From:` header.

- `mail.smtp_user`

  Configure the user account for the SMTP server in use.

- `mail.smtp_password`

  Configure the password for the SMTP server in use.

- `mail.smtp_host`

  Configure the host name of the SMTP server in use.

- `mail.smtp_port`

  Configure the port of the SMTP server in use.

### `mail_diff_stats`

This plugin sends statistics of type `diff`. It will send an email to every
recipient supplied using the `mail_recipient` query type. Skip the emailing if
there are no `added` of `removed` stats available.

**Configuration**:

Uses `mail_recipient` as query type.

- `mail.debug`

  Turn on debug mode. In this mode mails are not actually sent, but only
  logged to the screen.

- `mail.no-encrypt`

  Disable the gpg encryption for this run. Emails will be send in clear text. Every email is encrypted using gpg before sending. The `gpg` binary must be installed and the recipient's public key imported into the users keyring and be trusted. The email won't send if the encryption fails.

  **FIXME**: Not tested on Windows, how would it work there with the `gpg` binary?

- `mail.from`

  Set this email address as sender in the `From:` header.

- `mail.smtp_user`

  Configure the user account for the SMTP server in use.

- `mail.smtp_password`

  Configure the password for the SMTP server in use.

- `mail.smtp_host`

  Configure the host name of the SMTP server in use.

- `mail.smtp_port`

  Configure the port of the SMTP server in use.

The following example diffs two csv files, and mails in debug mode the diff
statistics to two recipients.

```shell
$(npm bin)/sugarcube -d \
  -Q mail_recipient:one@example.com \
  -Q mail_recipient:two@example.com \
  -Q glob_pattern:data/dump-$(date -d "today" +%Y-%m-%d).csv \
  -Q diff_glob_pattern:data/dump-$(date -d "yesterday" +%Y-%m-%d).csv \
  -p csv_import,csv_diff,mail_diff_stats \
  --csv.id_fields name \
  --mail.from three@example.com \
  --mail.debug
```

## Instruments

### `mail_report`

Mail a report at the end of a pipeline run. The report breaks down per plugin the statistics collected and includes a list of all failures that occurred. The failures are additionally attached as a CSV file. As a default all emails are gpp encrypted. For this you need to import all GPG keys of your recipients into the local keyring. You can opt-out of email encryption by setting the `mail.no_encrypt` to true.

**Configuration:**

- `mail.recipients`: A list of email addresses that should receive the report.
- `mail.no_encrypt`: Disable the gpg encryption for this run. Emails will be send in clear text. Every email is encrypted using gpg before sending. The `gpg` binary must be installed and the recipient's public key imported into the users keyring and be trusted. The email won't send if the encryption fails.
- `mail.from`: Set this email address as sender in the `From:` header.
- `mail.smtp_user`: Configure the user account for the SMTP server in use.
- `mail.smtp_password`: Configure the password for the SMTP server in use.
- `mail.smtp_host`: Configure the host name of the SMTP server in use.
- `mail.smtp_port`: Configure the port of the SMTP server in use.

## License

[GPL3](./LICENSE) @ [Christo](christo@cryptodrunks.net)
