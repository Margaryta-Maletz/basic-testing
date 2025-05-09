import axios from 'axios';
import { throttledGetDataFromApi } from './index';

jest.mock('axios');

jest.mock('lodash', () => ({
  throttle: jest.fn((fn) => fn),
}));

describe('throttledGetDataFromApi', () => {
  const mockedCreate = axios.create as jest.Mock;
  const mockedAxiosClient = {
    get: jest.fn(),
  };

  beforeEach(() => {
    mockedCreate.mockReturnValue(mockedAxiosClient);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('should create instance with provided base url', async () => {
    mockedAxiosClient.get.mockResolvedValue({ data: {} });

    await throttledGetDataFromApi('/test');

    expect(mockedCreate).toHaveBeenCalledWith({
      baseURL: 'https://jsonplaceholder.typicode.com',
    });
  });

  test('should perform request to correct provided url', async () => {
    mockedAxiosClient.get.mockResolvedValue({ data: {} });

    const relativePath = '/test-path';
    await throttledGetDataFromApi(relativePath);

    expect(mockedAxiosClient.get).toHaveBeenCalledWith(relativePath);
  });

  test('should return response data', async () => {
    const mockResponseData = { test: '123' };
    mockedAxiosClient.get.mockResolvedValue({ data: mockResponseData });

    const result = await throttledGetDataFromApi('/example');

    expect(result).toEqual(mockResponseData);
  });
});
