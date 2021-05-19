import replaceAll from './replaceAll';

describe('tls-graphql-utils:replaceAll', () => {
  it('should replace all 3 with a 4', () => {
    const replaced = replaceAll('12343123', '3', '4');

    expect(replaced).toBe('12444124');
  });
});
