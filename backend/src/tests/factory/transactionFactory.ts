/* eslint-disable import/no-extraneous-dependencies */
import { build, fake } from '@jackfranklin/test-data-bot';
import { Connection } from 'typeorm';

import Transaction from '../../models/Transaction';
import Account from '../../models/Account';

export type BuildType = Pick<Transaction, 'amount'>;

export const transactionBuilder = build<BuildType>('transaction', {
  fields: {
    amount: fake((faker) => faker.random.number(15000)),
  },
});

export const transactionFactory = (overrides?: Partial<BuildType>) =>
  transactionBuilder({
    map: (transaction) => ({ ...transaction, ...overrides }),
  });

export const transactionModelFactory = (
  accountId: number,
  resultantBalance: number,
  overrides?: Partial<BuildType>,
) => {
  const factoryTransaction = transactionFactory(overrides);
  const transaction = new Transaction({
    ...factoryTransaction,
    accountId,
    resultantBalance,
  });

  return { factoryTransaction, transaction };
};

export const createTransaction = async (
  connection: Connection,
  account: Account,
  overrides?: Partial<BuildType>,
) => {
  const entityManager = connection.createEntityManager();
  const factoryTransaction = transactionFactory(overrides);

  const databaseTransaction = await account.performTransaction(
    factoryTransaction.amount,
    { transaction: false, entityManager },
  );

  return {
    databaseTransaction,
    factoryTransaction,
    transaction: new Transaction({
      amount: factoryTransaction.amount,
      accountId: account.id,
      resultantBalance: account.balance,
    }),
  };
};
