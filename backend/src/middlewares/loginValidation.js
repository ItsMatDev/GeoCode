const Joi = require("joi");

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

const loginValidation = async (req, res, next) => {
  try {
    await loginSchema.validateAsync(req.body);
    return next();
  } catch (error) {
    return res.status(400).json(error.details.map((detail) => detail.message));
  }
};

module.exports = loginValidation;
