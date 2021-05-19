import isJSON from './isJSON';

describe('isJSON', () => {
  it('should return false when test a boolean', () => {
    expect(isJSON(false)).toBeFalsy();
    expect(isJSON(true)).toBeFalsy();
  });

  it('should return false when test a number', () => {
    expect(isJSON(123)).toBeFalsy();
  });

  it('should return false when test an object', () => {
    expect(isJSON({})).toBeFalsy();
  });

  it('should return false when test an object', () => {
    expect(isJSON([])).toBeFalsy();
  });

  it('should return false when test an empty string', () => {
    expect(isJSON('')).toBeFalsy();
  });

  it('should return false when a JSON string is tested where the key is not enclosed in quotes', () => {
    expect(isJSON('{foo:1}')).toBeFalsy();
  });

  it('should return false when a JSON string is tested where the value is not enclosed in quotes', () => {
    expect(isJSON('{"foo":bar}')).toBeFalsy();
  });

  it('should return true when a JSON string is tested where the key is not enclosed in quotes and the value is a number', () => {
    expect(isJSON('{"foo":1}')).toBeTruthy();
  });

  it('should return true when a JSON string is tested where the key is not enclosed in quotes and the value is a string', () => {
    expect(isJSON('{"foo":"bar"}')).toBeTruthy();
  });

  it('should return true when a JSON string is tested where has multiple levels', () => {
    expect(isJSON('{"foo":{"bar":{"fooBar":1}}}')).toBeTruthy();
  });
});
