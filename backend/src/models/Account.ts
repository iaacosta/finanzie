/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable no-param-reassign */
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  ManyToOne,
  Unique,
  OneToMany,
} from 'typeorm';
import { ObjectType, Field, ID, Int } from 'type-graphql';
import { IsNotEmpty, IsIn } from 'class-validator';

import { IsValidBalance } from '../utils';
import { AccountType } from '../graphql/helpers';
import User from './User';
import Transaction from './Transaction';
import Transfer from './Transfer';
import Passive from './Passive';

@ObjectType()
@Unique(['name', 'bank', 'userId'])
@Entity()
export default class Account {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id!: number;

  @Field(() => AccountType)
  @Column()
  @IsIn(['cash', 'vista', 'checking', 'root'] as AccountType[])
  type: AccountType | 'root';

  @Field()
  @Column()
  @IsNotEmpty()
  name: string;

  @Field()
  @Column()
  @IsNotEmpty()
  bank: string;

  @Field(() => Int)
  @Column()
  @IsValidBalance()
  balance: number;

  @Field(() => Int)
  @Column()
  unliquidatedBalance: number;

  @Column({ nullable: true })
  userId?: number;

  @Field(() => User)
  @ManyToOne(() => User, { eager: false, onDelete: 'SET NULL' })
  user?: User;

  @OneToMany(() => Transaction, (transaction) => transaction.account, {
    eager: false,
    onDelete: 'CASCADE',
  })
  transactions: Transaction[];

  @OneToMany(() => Transfer, (transfer) => transfer.account, {
    eager: false,
    onDelete: 'CASCADE',
  })
  transfers: Transfer[];

  @OneToMany(() => Passive, (passive) => passive.account, {
    eager: false,
    onDelete: 'CASCADE',
  })
  passives: Passive[];

  @Field()
  @CreateDateColumn()
  createdAt: Date;

  @Field()
  @UpdateDateColumn()
  updatedAt: Date;

  @Field({ nullable: true })
  @DeleteDateColumn()
  deletedAt: Date;

  static applyBalanceChanges(data: {
    amount: number;
    from: Account;
    to: Account;
  }): void {
    data.from.balance -= data.amount;
    data.to.balance += data.amount;
  }

  static applyPassiveBalanceChanges(data: {
    amount: number;
    from: Account;
    to: Account;
  }): void {
    Account.applyBalanceChanges({
      amount: -data.amount,
      from: data.from,
      to: data.to,
    });

    data.from.unliquidatedBalance -= data.amount;
    data.to.unliquidatedBalance += data.amount;
  }

  constructor(account: {
    type: AccountType | 'root';
    name: string;
    bank: string;
    userId?: number;
  }) {
    if (!account) return;
    this.type = account.type;
    this.name = account.name;
    this.bank = account.bank;
    this.userId = account.userId;
    this.balance = 0;
    this.unliquidatedBalance = 0;
  }
}
