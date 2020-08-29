/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable no-restricted-syntax */
/* eslint-disable no-await-in-loop */
import { createConnection, Connection } from 'typeorm';
import { UserInputError } from 'apollo-server-express';

import { seedTestDatabase, createPgClient } from '../../utils';
import User from '../../../models/User';
import Account from '../../../models/Account';
import { transactionFactory } from '../../factory/transactionFactory';
import { createUser } from '../../factory/userFactory';
import { createAccount } from '../../factory/accountFactory';
import { AccountType, CategoryType } from '../../../graphql/helpers';
import TransactionHelper from '../../../helpers/TransactionHelper';
import Category from '../../../models/Category';
import { createCategory } from '../../factory/categoryFactory';

describe('transaction ORM tests', () => {
  const testInitialBalance = 1000;

  let connection: Connection;
  let testUser: User;
  let testAccount: Account;
  let testCategory: Category;

  const pgClient = createPgClient();

  beforeAll(async () => {
    connection = await createConnection();
    await pgClient.connect();
  });

  beforeAll(async () => {
    await seedTestDatabase(pgClient);

    testUser = (await createUser(connection)).databaseUser;

    testAccount = (
      await createAccount(connection, testUser.id, {
        type: AccountType.cash,
        initialBalance: testInitialBalance,
      })
    ).databaseAccount;

    testCategory = (
      await createCategory(connection, testUser.id, {
        type: CategoryType.income,
      })
    ).databaseCategory;
  });

  afterAll(() => {
    connection.close();
    pgClient.end();
  });

  describe('subscribers', () => {
    describe('create', () => {
      it('should call validateOrReject on save', async () => {
        const transactionHelper = new TransactionHelper(testUser);
        const transaction = transactionFactory({
          amount: -2 * testInitialBalance,
        });

        await expect(
          transactionHelper.performTransaction(transaction, {
            account: testAccount,
            category: testCategory,
          }),
        ).rejects.toThrowError(UserInputError);
      });
    });
  });
});
