/* eslint-disable @typescript-eslint/no-non-null-assertion */
import React, { useMemo, useContext } from 'react';
import { Typography } from '@material-ui/core';
import { useSnackbar } from 'notistack';
import { useMutation } from '@apollo/client';
import { map, capitalize } from 'lodash';

import {
  MyAccountsQuery,
  UpdateTransactionMutation,
  UpdateTransactionMutationVariables,
  MyTransactionsQuery,
} from '../../@types/graphql';
import { updateTransactionMutation } from '../../graphql/transaction';
import { myAccountsQuery } from '../../graphql/account';
import { useRedirectedQuery } from '../../hooks/graphql/useRedirectedQuery';
import TransactionFormView from './TransactionFormView';
import { filterUnchangedValues } from '../../utils/formik';
import DialogFormContext from '../../contexts/DialogFormContext';

interface Props {
  transaction: MyTransactionsQuery['transactions'][number];
}

const UpdateTransactionDialog: React.FC<Props> = ({ transaction }) => {
  const { enqueueSnackbar } = useSnackbar();
  const { onClose } = useContext(DialogFormContext);
  const { data, loading } = useRedirectedQuery<MyAccountsQuery>(myAccountsQuery);

  const [updateTransaction, { loading: updateLoading }] = useMutation<
    UpdateTransactionMutation,
    UpdateTransactionMutationVariables
  >(updateTransactionMutation, {
    refetchQueries: [{ query: myAccountsQuery }],
  });

  const initialValues = useMemo(
    () => ({
      amount: Math.abs(transaction.amount),
      type: transaction.amount > 0 ? 'Income' : 'Expense',
      memo: transaction.memo || '',
      accountId: transaction.account.id,
    }),
    [transaction],
  );

  return (
    <TransactionFormView
      mode="update"
      accounts={data?.accounts}
      submitLoading={updateLoading}
      initialLoading={loading || !data}
      initialValues={initialValues}
      onSubmit={async ({ type, amount, ...values }) => {
        const toChange = { ...values, amount: type === 'Expense' ? -amount : amount };
        const { type: dump, ...original } = initialValues;

        try {
          await updateTransaction({
            variables: {
              input: {
                id: transaction.id,
                ...filterUnchangedValues(toChange, original),
              },
            },
          });
          enqueueSnackbar('Transaction updated successfully', { variant: 'success' });
          onClose();
        } catch (err) {
          /* TODO: research how to handle globally this stuff */
          const [graphQLError] = err.graphQLErrors;
          if (graphQLError.extensions.code === 'BAD_USER_INPUT') {
            const messages = map(graphQLError.extensions.fields, (value, idx) => (
              <Typography key={idx} variant="body2">
                {capitalize(value)}
              </Typography>
            ));

            enqueueSnackbar(messages, { variant: 'error' });
          } else {
            enqueueSnackbar(err.message, { variant: 'error' });
          }
        }
      }}
    />
  );
};

export default UpdateTransactionDialog;