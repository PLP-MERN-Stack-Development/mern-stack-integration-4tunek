const Joi = require('joi');

const postSchema = Joi.object({
  title: Joi.string().min(3).required(),
  content: Joi.string().min(10).required(),
});

module.exports = postSchema;
