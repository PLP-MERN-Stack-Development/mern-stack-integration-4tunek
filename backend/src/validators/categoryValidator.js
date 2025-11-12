const Joi = require('joi');


exports.categorySchema = Joi.object({
name: Joi.string().trim().min(1).max(100).required(),
description: Joi.string().allow('').max(500),
});