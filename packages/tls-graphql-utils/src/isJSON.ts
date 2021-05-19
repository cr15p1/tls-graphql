const isParsableString = (str: string) => {
  try {
    JSON.parse(str);
    return true;
  } catch {
    return false;
  }
};

const isJSON = (str: any) => {
  if (typeof str !== 'string') {
    return false;
  }
  return isParsableString(str);
};

export default isJSON;
