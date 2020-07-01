INSERT INTO unit (
  id_hash,
  id_fields,
  content_hash,
  content_fields,
  source,
  unit_id,
  body,
  href,
  author,
  title,
  description,
  language,
  created_at,
  fetched_at,
  data
) VALUES (
  ${idHash},
  ${idFields:json},
  ${contentHash},
  ${contentFields:json},
  ${source},
  ${unitId},
  ${body},
  ${href},
  ${author},
  ${title},
  ${description},
  ${language},
  ${createdAt},
  ${fetchedAt},
  ${data}
)
 ON CONFLICT (id_hash) DO UPDATE
SET body = excluded.body,
    href = excluded.href,
    author = excluded.author,
    title = excluded.title,
    description = excluded.description,
    language = excluded.language,
    data = excluded.data,
    updated_at = CURRENT_TIMESTAMP
RETURNING ID;
