const asyncHandler = (fx) => (req, res, next) =>
  Promise.resolve(fx(req, res, next)).catch((err) => next(err));

export default asyncHandler;
