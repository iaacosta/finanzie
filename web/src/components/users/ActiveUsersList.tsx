/* eslint-disable react-hooks/rules-of-hooks */
import React, { useMemo } from 'react';
import {
  makeStyles,
  Paper,
  Box,
  ListItemText,
  ListItem,
  ListItemSecondaryAction,
  Divider,
} from '@material-ui/core';
import { Delete as DeleteIcon, Edit as EditIcon } from '@material-ui/icons';
import { capitalize } from 'lodash';

import { usersQuery } from '../../graphql/users';
import { AllUsersQuery } from '../../@types/graphql';
import { useRedirectedQuery } from '../../hooks/graphql/useRedirectedQuery';
import VirtualizedList from '../ui/VirtualizedList';
import EnhancedIconButton from '../ui/EnhancedIconButton';
import { useDeleteUser } from '../../hooks/graphql/useDeleteUser';
import { roles } from '../../utils/rbac';
import UpdateUserDialog from './UpdateUserDialog';
import { useToggleable } from '../../hooks/utils/useToggleable';

const useStyles = makeStyles((theme) => ({
  list: { flex: 1 },
  container: { listStyle: 'none' },
  secondaryActions: {
    display: 'flex',
    '& > *:not(:last-child)': { marginRight: theme.spacing(1) },
  },
}));

const ActiveUsersList: React.FC = () => {
  const classes = useStyles();
  const { data, loading } = useRedirectedQuery<AllUsersQuery>(usersQuery);
  const users: AllUsersQuery['users'] = useMemo(() => data?.users || [], [data]);

  return (
    <Paper elevation={1} className={classes.list} square>
      <VirtualizedList data={users} loading={loading || !data}>
        {({ index, style, data: userData }) => {
          const { toggled, set } = useToggleable();
          const { id, name, username, role } = userData[index];
          const [deleteUser, { loading: deleteLoading }] = useDeleteUser();
          return (
            <Box style={style} key={index}>
              <ListItem classes={{ container: classes.container }} component="div">
                <ListItemText
                  primary={`${name}`}
                  secondary={`@${username} / ${capitalize(role)}`}
                />
                <ListItemSecondaryAction className={classes.secondaryActions}>
                  <EnhancedIconButton onClick={() => set(true)} contained color="info">
                    <EditIcon fontSize="small" />
                  </EnhancedIconButton>
                  <UpdateUserDialog
                    open={toggled}
                    onClose={() => set(false)}
                    user={userData[index]}
                  />
                  <EnhancedIconButton
                    contained
                    disabled={deleteLoading || role === roles.ADMIN}
                    onClick={() => deleteUser(id)}
                    color="error"
                  >
                    <DeleteIcon fontSize="small" />
                  </EnhancedIconButton>
                </ListItemSecondaryAction>
              </ListItem>
              <Divider variant="middle" />
            </Box>
          );
        }}
      </VirtualizedList>
    </Paper>
  );
};

export default ActiveUsersList;