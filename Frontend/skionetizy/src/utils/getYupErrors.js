export default function getYupErrors(error) {
  const betterErrors = {};

  /**
   * ValidationError has two main properties:
   * "path" - the name of field that failed and
   * "message" - the error message for field
   *
   * other one is "inner" property
   *
   * yup keeps collecting errors in "inner"
   * property as array of ValidationError s
   * instead of throw on first validation fail
   *
   * ValidationError structure
   * {
   *   path: string,
   *   message: string,
   *   inner: [
   *     {
   *       path: string,
   *       message: string,
   *     },
   *     {
   *       path: string,
   *       message: string,
   *     }
   *   ]
   * }
   *
   * Docs         : https://www.npmjs.com/package/yup#validationerrorerrors-string--arraystring-value-any-path-string
   * Github Issue : https://github.com/jquense/yup/issues/44
   *
   */
  for (const yupError of error.inner) {
    // create a key from variable using
    // es6 computed property syntax
    betterErrors[yupError.path] = yupError.message;
  }

  return betterErrors;
}
