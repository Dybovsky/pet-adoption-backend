const S = require("fluent-json-schema").default;

const NewPetValSchema = S.object()
  .prop("name", S.string().minLength(1).required())
  .prop("breed", S.string().minLength(1).required())
  .prop("type", S.string().minLength(1).required())
  .prop("status", S.string().minLength(1).required())

  .prop("height", S.string().minLength(1).required())
  .prop("weight", S.string().minLength(1).required())
  .prop("color", S.string().minLength(1).required())
  .prop("bio", S.string().minLength(1).required())
  .prop("allergy", S.boolean().required())
  .prop("diet", S.string().minLength(1).required())
  .valueOf();

exports.NewPetValSchema = NewPetValSchema;
