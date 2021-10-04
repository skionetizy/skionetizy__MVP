export default function getFrontendURL(uri) {
  if (process.env.NODE_ENV === "development") {
    return "http://localhost:3000" + uri;
  } else {
    return process.env.REACT_APP_DOMAIN + uri;
  }
}
