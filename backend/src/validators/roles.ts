import Joi from "joi";

const roleAddSchema = Joi.object({
  username: Joi.string().min(2).max(30).required(),
  role: Joi.string().min(2).max(30).required(),
});

export { roleAddSchema };
