import { gql } from 'apollo-server-express';

export default gql`
  type DebitAccount {
    id: ID!
    name: String!
    bank: String!
    initialBalance: Int!
    allowsNegative: Boolean!
    currency: Currency!
  }

  type CreditAccount {
    id: ID!
    name: String!
    bank: String!
    initialBalance: Int!
    billingDay: Int!
    paymentDay: Int!
    currency: Currency!
  }
`;