const MAX_DESC = 80;

export function linkedin({ url, description }) {
  const params = new URLSearchParams({
    mini: true,
    summary: encodeURIComponent(description.substr(0, MAX_DESC) + "..."),
    url: encodeURIComponent(url),
  });

  return "https://www.linkedin.com/sharing/share-offsite/?" + params.toString();
}

export function whatsapp({ url, description }) {
  const params = new URLSearchParams({
    phone: "",
    text: encodeURIComponent(
      description.substr(0, MAX_DESC) + "..." + encodeURIComponent(url)
    ),
    lang: "en-IN",
  });

  return "https://api.whatsapp.com/send?" + params.toString();
}

export function twitter({ url, description }) {
  const params = new URLSearchParams({
    url: url,
    text: description.substr(0, MAX_DESC),
    via: window.location.hostname,
  });

  return "https://twitter.com/intent/tweet?" + params.toString();
}

export function facebook({ url }) {
  return `http://www.facebook.com/sharer.php?u=${encodeURIComponent(url)}`;
}
