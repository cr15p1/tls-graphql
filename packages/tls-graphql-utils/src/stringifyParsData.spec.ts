import stringifyData from './stringifyData';
import parseData from './parseData';

describe('stringifyParseData', () => {
  it('should stringify the data and parse it back to an equal object when there is the delimiter in a value', () => {
    const expected = { 'foo': ":!:" }
    const str = stringifyData(expected);
    const parsed = parseData(str);
    expect(parsed).toEqual(parsed);
  })
})