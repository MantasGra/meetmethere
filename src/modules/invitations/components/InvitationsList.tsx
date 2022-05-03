import { Launch } from '@mui/icons-material';
import EventIcon from '@mui/icons-material/Event';
import { Card, CardContent, CardHeader, CircularProgress } from '@mui/material';
import { useEffect, Fragment } from 'react';
import { generatePath, useNavigate } from 'react-router-dom';
import NoContent from 'src/components/StatusIcons/NoContent';
import { Routes } from 'src/constants/enums';
import { useAppDispatch, useAppSelector } from 'src/hooks/redux';
import { toDate } from 'src/utils/transformators';

import { invitationsLoadInvitationsProposal } from '../actions';
import {
  invitationsListSelector,
  invitationsLoadingSelector,
} from '../selectors';

import classes from './InvitationsList.styles';

const InvitationsList: React.FC = () => {
  const dispatch = useAppDispatch();

  const invitations = useAppSelector(invitationsListSelector);
  const loading = useAppSelector(invitationsLoadingSelector);

  useEffect(() => {
    dispatch(invitationsLoadInvitationsProposal);
  }, [dispatch]);

  const navigate = useNavigate();
  const openMeetingPage = (id: string) => {
    navigate(generatePath(Routes.MeetingPage, { id }));
  };

  return (
    <div css={classes.invitationsList}>
      {loading && <CircularProgress size={140} />}
      {invitations.length ? (
        <Fragment>
          {invitations.map((invitation) => (
            <Card
              key={invitation.id}
              css={classes.invitationListItem}
              onClick={() => openMeetingPage(invitation.id.toString())}
              raised
            >
              <CardHeader
                avatar={<EventIcon />}
                title={invitation.name}
                titleTypographyProps={{ variant: 'h5' }}
                subheader={
                  invitation.isDatesPollActive
                    ? 'Dates poll active'
                    : toDate(invitation.startDate).toLocaleString()
                }
                action={<Launch />}
              />
              <CardContent css={classes.invitationListItemContent}>
                {invitation.description}
              </CardContent>
            </Card>
          ))}
        </Fragment>
      ) : (
        <NoContent text="You have no invitations!" />
      )}
    </div>
  );
};

export default InvitationsList;
