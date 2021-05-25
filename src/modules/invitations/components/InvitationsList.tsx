import { Card, CardContent, CardHeader, CircularProgress } from '@material-ui/core';
import React, { useEffect } from 'react';
import NoContent from 'src/components/NoContent';
import EventIcon from '@material-ui/icons/Event';
import { useAppDispatch, useAppSelector } from 'src/hooks/redux';
import { invitationsLoadInvitationsProposal } from '../actions';
import { invitationsListSelector, invitationsLoadingSelector } from '../selectors';

import classes from './InvitationsList.module.scss';
import { generatePath, useHistory } from 'react-router';
import { Routes } from 'src/constants/enums';
import MeetingStatusChip from 'src/modules/meetings/components/MeetingStatusChip';
import { Launch } from '@material-ui/icons';

const InvitationsList: React.FC = () => {
  const dispatch = useAppDispatch();

  const invitations = useAppSelector(invitationsListSelector);
  const loading = useAppSelector(invitationsLoadingSelector);

  useEffect(() => {
    dispatch(invitationsLoadInvitationsProposal);
  }, [])

  const history = useHistory();
  const openMeetingPage = (id: string) => {
    history.push(generatePath(Routes.MeetingPage, { id }));
  };

  return (
    <>
      <div className={classes.invitationsList}>
        {loading && (
              <div className={classes.loading}>
                <CircularProgress size={140} />
              </div>
            )}
        {invitations.length ? (
          <>
            {invitations.map((invitation, index) => (
              <Card
                key={invitation.id}
                className={classes.invitationListItem}
                onClick={() => openMeetingPage(invitation.meeting.id.toString())}
                raised
              >
                <CardHeader
                  avatar={<EventIcon />}
                  title={invitation.meeting.name}
                  titleTypographyProps={{ variant: 'h5' }}
                  subheader={
                    new Date(invitation.meeting.startDate).toLocaleString()
                  }
                  action={
                    <>
                      <Launch />
                    </>
                  }
                />
                <CardContent className={classes.invitationListItemContent}>
                  <div className={classes.description}>
                    {invitation.meeting.description}
                  </div>
                  
                </CardContent>
              </Card>
            ))}
          </>
        ) : (
          <NoContent text="You have no invitations!" />
        )}
      </div>
    </>
  );
};

export default InvitationsList;
