import stringifyData from './stringifyData';

describe('stringifyData', () => {
  it('should escape the delimiters in value', () => {
    const str = stringifyData({ foo: ':!:' });
    expect(str).toEqual('{\"foo\":\"\\\\:\\\\!\\\\:\"}')
  })
})