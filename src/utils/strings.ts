export const formatDomain = (domain: string) => {
  let result = domain;
  result = result.replace("http://", "").replace("https://", "");
  const index = result.indexOf("/");
  if (index > 0) {
    result = result.substring(0, index)
  }
  return result
}
