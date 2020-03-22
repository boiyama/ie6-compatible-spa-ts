function createMatch(
  isExact: boolean,
  path: string,
  url: string,
  params?: { [path: string]: string }
) {
  return {
    isExact: isExact,
    path: path,
    url: url,
    params: params
  };
}

function trimTrailingSlash(url: string) {
  let len;
  for (len = url.length; "/" === url[--len]; );
  return url.slice(0, len + 1);
}

function decodeParam(val: string) {
  try {
    return decodeURIComponent(val);
  } catch (e) {
    return val;
  }
}

export function parseRoute(
  path: string,
  url: string,
  options: { exact: boolean }
) {
  if (path === url || !path) {
    return createMatch(path === url, path, url);
  }

  const exact = options && options.exact;
  const paths = trimTrailingSlash(path).split("/");
  const urls = trimTrailingSlash(url).split("/");

  if (paths.length > urls.length || (exact && paths.length < urls.length)) {
    return;
  }

  let params: { [path: string]: string } = {},
    newUrl = "";

  for (let i = 0; i < paths.length; i++) {
    if (":" === paths[i][0]) {
      params[paths[i].slice(1)] = urls[i] = decodeParam(urls[i]);
    } else if (paths[i] !== urls[i]) {
      return;
    }
    newUrl += urls[i] + "/";
  }

  return createMatch(false, path, newUrl.slice(0, -1), params);
}
