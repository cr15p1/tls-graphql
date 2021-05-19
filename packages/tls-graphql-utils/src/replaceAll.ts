const replaceAll = (
  str: string,
  search: string | RegExp,
  replacement: string
) => str.split(search).join(replacement);

export default replaceAll;
