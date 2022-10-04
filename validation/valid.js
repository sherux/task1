const Joi = require("joi");
// ----------------------------------register validation---------------------------------
const registervalidation = (data) => {
  const schema = Joi.object({
    name: Joi.string().trim().min(3).required(),
    email: Joi.string()
      .lowercase()
      .email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } }),
    password: Joi.number().min(4).required(),
    mobile: Joi.string().required(),
    country: Joi.string().trim().min(3).required(),
    city: Joi.string().trim().min(3).required(),
  });
  return schema.validate(data);
};

// ----------------------------------login validation---------------------------------

const loginvalidation = (data) => {
  const schema = Joi.object({
    email: Joi.string()
      .lowercase()
      .email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } }),
    password: Joi.string().min(4).required(),
  });
  return schema.validate(data);
};

// --------------------------------------module export------------------------------------

module.exports.registervalidation = registervalidation;
module.exports.loginvalidation = loginvalidation;
