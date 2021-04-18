const S = require("fluent-json-schema").default;

const NewUserValSchema = S.object()
  .prop("firstName", S.string().minLength(1).required())
  .prop("lastName", S.string().minLength(1).required())
  .prop("email", S.string().minLength(1).required())
  .prop("phone", S.string().minLength(1).required())
  .prop("password", S.string().minLength(3).required())
  .prop("passwordCheck", S.string().minLength(3).required())
  .valueOf();

exports.NewUserValSchema = NewUserValSchema;
