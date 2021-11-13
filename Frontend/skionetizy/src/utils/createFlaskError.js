function createFlaskError(message, error) {
  const err = new Error(message);
  err.isFlaskError = true;
  if (error) err.cause = error;

  //console.log("made error", err);

  return err;
}

export default createFlaskError;
