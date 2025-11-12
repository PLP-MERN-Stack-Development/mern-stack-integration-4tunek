// src/middleware/validate.js
// Middleware to validate request body against a Joi schema
module.exports = (schema) => {
  if (!schema || typeof schema.validate !== 'function') {
    throw new Error(
      'A valid Joi schema must be provided to validate middleware'
    );
  }

  return (req, res, next) => {
    // Log the incoming request body
    console.log("Incoming request body for validation:", req.body);

    const { error, value } = schema.validate(req.body, { abortEarly: false });

    if (error) {
      // Log detailed Joi validation errors
      console.log("Joi validation errors:", error.details);

      const messages = error.details.map((detail) => detail.message);
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: messages,
      });
    }

    // Log the validated value if needed
    console.log("Validated value:", value);

    next(); 
  };
};
