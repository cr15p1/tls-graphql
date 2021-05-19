import socketDataToJSONArray from './socketDataToJSONArray';

describe('tls-graphql-utils:socketDataToJSONArray', () => {
  it('should split the data into an array with single entry without an rest when the divider `:!:` is on the end', () => {
    const [array, rest] = socketDataToJSONArray('{"foo":"bar"}');
    expect(array).toContainEqual({ foo: 'bar' });
    expect(rest).toBe('');
  });

  it('should split the data into an array with two entries without an rest when the divider `:!:` is on the end of every object', () => {
    const [array, rest] = socketDataToJSONArray(
      '{"foo":"bar"}:!:{"bar":"foo"}'
    );
    expect(array).toContainEqual({ foo: 'bar' });
    expect(array).toContainEqual({ bar: 'foo' });
    expect(array).toHaveLength(2);
    expect(rest).toBe('');
  });

  it('should split the data into an array with single entry with an rest when the divider `:!:` is only on the end of the first object', () => {
    const [array, rest] = socketDataToJSONArray('{"foo":"bar"}:!:{"bar":');
    expect(array).toContainEqual({ foo: 'bar' });
    expect(array).toHaveLength(1);
    expect(rest).toBe('{"bar":');
  });

  it('should not split the data an return the complete data as rest when the data is not completed wit the divider `:!:`', () => {
    const data = '{"foo":"bar"}:!';
    const [array, rest] = socketDataToJSONArray(data);
    expect(array).toHaveLength(0);
    expect(rest).toBe(data);
  });
});
