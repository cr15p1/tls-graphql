import replaceAll from './replaceAll';

const stringifyData = (data: any) =>
  JSON.stringify(data, (key, value) => {
    if (typeof value !== 'string') {
      return value;
    }
    return replaceAll(value, ':!:', '\\:\\!\\:');
  });

export default stringifyData;
