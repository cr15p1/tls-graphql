import parseData from './parseData';

describe('parseData', () => {
  it('should parse a string JSON and replace the delimiter values in string', () => {
    const parsed = parseData('{"0":"\\\\:\\\\!\\\\:"}');
    expect(parsed).toEqual({ 0: ':!:' });
  });
});
