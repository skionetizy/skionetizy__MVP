function createFlaskError(message, error) {
  const err = new Error(message);
  err.isFlaskError = true;
  if (error) err.cause = error;
  return err;
}

export default createFlaskError;
