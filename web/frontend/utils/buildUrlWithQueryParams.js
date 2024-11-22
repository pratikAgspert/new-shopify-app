export function buildUrlWithQueryParams(baseUrl, queryParams = {}) {
  const url = new URL(baseUrl);

  Object.keys(queryParams).forEach((key) =>
    url.searchParams.append(key, queryParams?.[key])
  );

  return url.toString();
}

export default buildUrlWithQueryParams;
