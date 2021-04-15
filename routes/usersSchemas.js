const S = require("fluent-json-schema").default;

const NewUserValSchema = S.object()
  .prop("text", S.string().minLength(1).required())
  .valueOf();

exports.NewUserValSchema = NewUserValSchema;
