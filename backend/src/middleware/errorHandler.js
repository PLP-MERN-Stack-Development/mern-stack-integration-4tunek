// Handles all errors centrally
module.exports = (err, req, res, next) => {
  console.error(err); // log for debugging

  const status = err.status || 500;
  const message = err.message || 'Internal Server Error';

  // Mongoose validation errors
  if (err.name === 'ValidationError') {
    const errors = Object.values(err.errors).map(e => e.message);
    return res.status(400).json({ success: false, message: 'Validation error', errors });
  }

  // Duplicate key (e.g., unique email)
  if (err.code && err.code === 11000) {
    return res.status(409).json({ success: false, message: 'Duplicate key error', keyValue: err.keyValue });
  }

  res.status(status).json({ success: false, message });
};
