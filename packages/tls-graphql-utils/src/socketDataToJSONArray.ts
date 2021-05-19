import isJSON from './isJSON';
import parseData from './parseData';

const socketDataToJSONArray = (buffer) => {
  const divided = buffer.split(':!:');
  const last = divided[divided.length - 1];
  const lastIsJSON = isJSON(last);
  const parts = divided
    .splice(0, divided.length - (lastIsJSON ? 0 : 1))
    .map((part) => parseData(part));
  return [parts, lastIsJSON ? '' : divided[0]];
};

export default socketDataToJSONArray;
