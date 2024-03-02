const argon2 = require("argon2");
const Joi = require("joi");

const hashingOptions = {
  type: argon2.argon2id,
  memoryCost: 19 * 2 ** 10,
  timeCost: 2,
  parallelism: 1,
};

const hashPassword = async (req, res, next) => {
  try {
    const { password } = req.body;

    const hashedPassword = await argon2.hash(password, hashingOptions);

    req.body.hashedPassword = hashedPassword;

    delete req.body.password;

    next();
  } catch (err) {
    next(err);
  }
};

const validateSchema = (schema) => (req, res, next) => {
  const { error } = schema.validate(req.body, { abortEarly: false });
  if (error) {
    const errors = error.details.map((err) => err.message);
    return res.status(400).json({ errors });
  }
  next();
  return null;
};

const userSchema = Joi.object({
  lastName: Joi.string().min(1).max(255).required(),
  firstName: Joi.string().min(1).max(255).required(),
  image: Joi.any(),
  email: Joi.string().email({ tlds: false }).max(255).required(),
  gender: Joi.string().min(1).max(255).required(),
  birthdate: Joi.string().min(1).max(255).required(),
  zipcode: Joi.string()
    .pattern(/^\d{5}$/)
    .required(),
  city: Joi.string().min(1).max(255).required(),
  password: Joi.string().min(5).max(255).required(),
});

const validateUserSchema = validateSchema(userSchema);

module.exports = {
  hashPassword,
  validateUserSchema,
};
