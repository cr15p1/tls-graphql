const parseData = (str: string) => {
  return JSON.parse(str, (key, value) => {
    if (typeof value !== 'string') {
      return value;
    }
    return value.replace('\\:\\!\\:', ':!:');
  });
};

export default parseData;
