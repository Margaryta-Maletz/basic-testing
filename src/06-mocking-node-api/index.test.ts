const mockedJoin = jest.fn();
const mockedExistsSync = jest.fn();
const mockedReadFile = jest.fn();
import { readFileAsynchronously, doStuffByTimeout, doStuffByInterval } from '.';

describe('doStuffByTimeout', () => {
  beforeAll(() => {
    jest.useFakeTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
    jest.restoreAllMocks();
  });

  beforeEach(() => {
    jest.spyOn(global, 'setTimeout');
  });

  afterEach(() => {
    jest.clearAllTimers();
    jest.clearAllMocks();
  });

  test('should set timeout with provided callback and timeout', () => {
    const mockCallback = jest.fn();
    const timeout = 1000;

    doStuffByTimeout(mockCallback, timeout);

    expect(setTimeout).toHaveBeenCalledWith(mockCallback, timeout);
  });

  test('should call callback only after timeout', () => {
    const mockCallback = jest.fn();
    const timeout = 1000;

    doStuffByTimeout(mockCallback, timeout);

    expect(mockCallback).not.toHaveBeenCalled();

    jest.advanceTimersByTime(timeout);
    expect(mockCallback).toHaveBeenCalledTimes(1);
  });
});

describe('doStuffByInterval', () => {
  beforeAll(() => {
    jest.useFakeTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
    jest.restoreAllMocks();
  });

  beforeEach(() => {
    jest.spyOn(global, 'setInterval');
  });

  afterEach(() => {
    jest.clearAllTimers();
    jest.clearAllMocks();
  });

  test('should set interval with provided callback and timeout', () => {
    const mockCallback = jest.fn();
    const interval = 1000;

    doStuffByInterval(mockCallback, interval);

    expect(setInterval).toHaveBeenCalledWith(mockCallback, interval);
  });

  test('should call callback multiple times after multiple intervals', () => {
    const mockCallback = jest.fn();
    const interval = 1000;

    doStuffByInterval(mockCallback, interval);

    expect(mockCallback).not.toHaveBeenCalled();

    jest.advanceTimersByTime(interval);
    expect(mockCallback).toHaveBeenCalledTimes(1);

    jest.advanceTimersByTime(interval * 2);
    expect(mockCallback).toHaveBeenCalledTimes(3);

    jest.advanceTimersByTime(interval * 5);
    expect(mockCallback).toHaveBeenCalledTimes(8);
  });
});

jest.mock('path', () => ({
  join: mockedJoin,
}));

jest.mock('fs', () => ({
  existsSync: mockedExistsSync,
}));

jest.mock('fs/promises', () => ({
  readFile: mockedReadFile,
}));

describe('readFileAsynchronously', () => {
  const MOCK_DIRNAME = '/mocked/directory';
  const MOCK_PATH = 'test.txt';
  const MOCK_FULL_PATH = `${MOCK_DIRNAME}/${MOCK_PATH}`;
  const MOCK_FILE_CONTENT = 'Hello world';

  afterAll(() => {
    jest.restoreAllMocks();
  });

  beforeEach(() => {
    mockedJoin.mockReturnValue(MOCK_FULL_PATH);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('should call join with pathToFile', async () => {
    mockedExistsSync.mockReturnValue(false);

    await readFileAsynchronously(MOCK_PATH);

    expect(mockedJoin).toHaveBeenCalledWith(expect.any(String), MOCK_PATH);
  });

  test('should return null if file does not exist', async () => {
    mockedExistsSync.mockReturnValue(false);

    const result = await readFileAsynchronously(MOCK_PATH);

    expect(result).toBeNull();
    expect(mockedExistsSync).toHaveBeenCalledWith(MOCK_FULL_PATH);
    expect(mockedReadFile).not.toHaveBeenCalled();
  });

  test('should return file content if file exists', async () => {
    mockedExistsSync.mockReturnValue(true);
    mockedReadFile.mockResolvedValue(Buffer.from(MOCK_FILE_CONTENT));

    const result = await readFileAsynchronously(MOCK_PATH);

    expect(mockedExistsSync).toHaveBeenCalledWith(MOCK_FULL_PATH);
    expect(mockedReadFile).toHaveBeenCalledWith(MOCK_FULL_PATH);
    expect(result).toBe(MOCK_FILE_CONTENT);
  });
});
