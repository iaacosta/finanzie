import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import DebitAccount from './DebitAccount';
import CreditAccount from './CreditAccount';

@Entity()
export default class Currency {
  constructor(name: string) {
    this.name = name;
  }

  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ unique: true })
  name: string;

  @OneToMany(
    () => DebitAccount,
    (acc) => acc.currency,
    { onDelete: 'SET NULL' },
  )
  debitAccounts!: DebitAccount[];

  @OneToMany(
    () => CreditAccount,
    (acc) => acc.currency,
    { onDelete: 'SET NULL' },
  )
  creditAccounts!: CreditAccount[];
}
