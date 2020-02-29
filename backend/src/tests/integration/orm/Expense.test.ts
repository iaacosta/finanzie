/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { createConnection, Connection } from 'typeorm';
import dayjs from 'dayjs';

import {
  seedCategories,
  seedSubCategories,
  seedCurrencies,
  seedAccounts,
  seedPlaces,
  seedExpenses,
} from '../../utils';
import { expenses } from '../../utils/data.json';
import Expense from '../../../models/Expense';
import Account from '../../../models/Account';
import SubCategory from '../../../models/SubCategory';
import Place from '../../../models/Place';

console.log = jest.fn();

describe('Expense ORM tests', () => {
  let connection: Connection;

  beforeAll(async () => {
    connection = await createConnection();
  });

  beforeEach(() =>
    seedCategories()
      .then(seedSubCategories)
      .then(seedCurrencies)
      .then(seedAccounts)
      .then(seedPlaces)
      .then(seedExpenses),
  );

  afterAll(() => connection.close());

  it('should parse date correctly on load', async () => {
    const expense = await connection
      .getRepository(Expense)
      .findOne(expenses[0].id);

    expect(expense).toBeTruthy();
    expect(expense!.date).toStrictEqual(dayjs(expenses[0].date));
  });

  it('should serialize date correctly on save', async () => {
    const account = await connection.getRepository(Account).findOne();
    const subCategory = await connection.getRepository(SubCategory).findOne();
    const place = await connection.getRepository(Place).findOne();

    await connection
      .getRepository(Expense)
      .save(
        new Expense(
          1234,
          dayjs('2020-01-01T00:00:00.000Z'),
          account!,
          subCategory!,
          place!,
        ),
      );

    const [
      { date },
    ] = await connection.query('SELECT date FROM expense WHERE amount = $1;', [
      1234,
    ]);

    expect(date.toISOString()).toBe('2020-01-01T00:00:00.000Z');
  });
});