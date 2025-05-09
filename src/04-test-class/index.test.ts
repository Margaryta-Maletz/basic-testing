const mockedRandom = jest.fn();
import {
  getBankAccount,
  InsufficientFundsError,
  SynchronizationFailedError,
  TransferFailedError,
} from '.';

jest.mock('lodash', () => ({
  random: mockedRandom,
}));

describe('BankAccount', () => {
  test('should create account with initial balance', () => {
    const initialBalance = 1;
    const bankAccount = getBankAccount(initialBalance);

    expect(bankAccount.getBalance()).toEqual(initialBalance);
  });

  test('should throw InsufficientFundsError error when withdrawing more than balance', () => {
    const initialBalance = 1;
    const bankAccount = getBankAccount(initialBalance);

    try {
      bankAccount.withdraw(initialBalance + 1);
    } catch (err) {
      expect(err).toBeInstanceOf(InsufficientFundsError);

      if (err instanceof InsufficientFundsError) {
        expect(err.message).toEqual(
          `Insufficient funds: cannot withdraw more than ${initialBalance}`,
        );
      }
    }
  });

  test('should throw error when transferring more than balance', () => {
    const initialBalance = 1;
    const bankAccount = getBankAccount(initialBalance);
    const toAccount = getBankAccount(initialBalance);

    try {
      bankAccount.transfer(initialBalance + 1, toAccount);
    } catch (err) {
      expect(err).toBeInstanceOf(InsufficientFundsError);

      if (err instanceof InsufficientFundsError) {
        expect(err.message).toEqual(
          `Insufficient funds: cannot withdraw more than ${initialBalance}`,
        );
      }
    }
  });

  test('should throw error when transferring to the same account', () => {
    const initialBalance = 1;
    const bankAccount = getBankAccount(initialBalance);

    try {
      bankAccount.transfer(initialBalance + 1, bankAccount);
    } catch (err) {
      expect(err).toBeInstanceOf(TransferFailedError);

      if (err instanceof TransferFailedError) {
        expect(err.message).toEqual('Transfer failed');
      }
    }
  });

  test('should deposit money', () => {
    const initialBalance = 1;
    const deposit = 1;
    const bankAccount = getBankAccount(initialBalance);

    bankAccount.deposit(deposit);

    expect(bankAccount.getBalance()).toEqual(initialBalance + deposit);
  });

  test('should withdraw money', () => {
    const initialBalance = 1;
    const bankAccount = getBankAccount(initialBalance);

    bankAccount.withdraw(initialBalance);

    expect(bankAccount.getBalance()).toEqual(0);
  });

  test('should transfer money', () => {
    const initialBalance = 1;
    const bankAccount = getBankAccount(initialBalance);
    const toAccount = getBankAccount(initialBalance);

    bankAccount.transfer(initialBalance, toAccount);

    expect(bankAccount.getBalance()).toEqual(0);
    expect(toAccount.getBalance()).toEqual(initialBalance + initialBalance);
  });

  test('fetchBalance should return number in case if request did not failed', async () => {
    const initialBalance = 1;
    const fetchedBalance = 100;
    const bankAccount = getBankAccount(initialBalance);

    mockedRandom.mockReturnValueOnce(fetchedBalance).mockReturnValueOnce(1);
    let balance = await bankAccount.fetchBalance();
    expect(balance).toEqual(fetchedBalance);

    mockedRandom.mockReturnValueOnce(fetchedBalance).mockReturnValueOnce(0);
    balance = await bankAccount.fetchBalance();
    expect(balance).toBeNull();
  });

  test('should set new balance if fetchBalance returned number', async () => {
    const initialBalance = 1;
    const fetchedBalance = 100;
    const bankAccount = getBankAccount(initialBalance);

    mockedRandom.mockReturnValueOnce(fetchedBalance).mockReturnValueOnce(1);
    await bankAccount.synchronizeBalance();

    expect(bankAccount.getBalance()).toEqual(fetchedBalance);
  });

  test('should throw SynchronizationFailedError if fetchBalance returned null', async () => {
    const initialBalance = 1;
    const fetchedBalance = 100;
    const bankAccount = getBankAccount(initialBalance);

    mockedRandom.mockReturnValueOnce(fetchedBalance).mockReturnValueOnce(0);

    try {
      await bankAccount.synchronizeBalance();
    } catch (err) {
      expect(err).toBeInstanceOf(SynchronizationFailedError);

      if (err instanceof SynchronizationFailedError) {
        expect(err.message).toEqual('Synchronization failed');
      }
    }
  });
});
