import { generateLinkedList } from './index';

describe('generateLinkedList', () => {
  test('should generate linked list from values 1', () => {
    const linkedList = generateLinkedList(['first', 'second']);
    const expectedResult = {
      value: 'first',
      next: {
        value: 'second',
        next: {
          value: null,
          next: null,
        },
      },
    };

    expect(linkedList).toStrictEqual(expectedResult);
  });

  test('should generate linked list from values 2', () => {
    const linkedList = generateLinkedList(['1st', '2nd']);

    expect(linkedList).toMatchSnapshot();
  });
});
