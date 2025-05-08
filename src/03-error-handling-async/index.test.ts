import {
  throwError,
  throwCustomError,
  resolveValue,
  MyAwesomeError,
  rejectCustomError,
} from './index';

describe('resolveValue', () => {
  test('should resolve provided value', async () => {
    const value = 'test';

    await expect(resolveValue(value)).resolves.toEqual(value);
  });
});

describe('throwError', () => {
  test('should throw error with provided message', () => {
    const msg = 'Error message';

    expect(() => throwError(msg)).toThrowError(msg);
  });

  test('should throw error with default message if message is not provided', () => {
    expect(throwError).toThrowError('Oops!');
  });
});

describe('throwCustomError', () => {
  test('should throw custom error', () => {
    try {
      throwCustomError();
    } catch (err) {
      expect(err).toBeInstanceOf(MyAwesomeError);

      if (err instanceof MyAwesomeError) {
        expect(err.message).toEqual('This is my awesome custom error!');
      }
    }
  });
});

describe('rejectCustomError', () => {
  test('should reject custom error', async () => {
    await expect(rejectCustomError).rejects.toBeInstanceOf(MyAwesomeError);
  });
});
