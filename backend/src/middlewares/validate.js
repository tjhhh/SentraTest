function validate(schema, source = "body") {
  return (req, _res, next) => {
    const parsed = schema.safeParse(req[source]);
    if (!parsed.success) {
      const err = new Error("Validation failed");
      err.status = 400;
      err.details = parsed.error.flatten();
      return next(err);
    }

    req[source] = parsed.data;
    return next();
  };
}

module.exports = { validate };
