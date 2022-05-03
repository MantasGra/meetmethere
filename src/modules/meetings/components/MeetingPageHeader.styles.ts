import { css } from '@emotion/react';

const meetingPageHeader = css`
  padding: 20px 45px;
  @media (max-width: 768px) {
    padding: 15px;
  }
`;

const meetingTitleRow = css`
  display: flex;
  flex-direction: row;
  justify-content: space-between;

  @media (max-width: 768px) {
    flex-wrap: wrap;
    gap: 10px;
  }
`;

const meetingTitleText = css`
  margin-right: 20px;
`;

const meetingTitle = css`
  display: flex;

  @media (max-width: 768px) {
    align-items: flex-start;
    flex-direction: column;
    gap: 10px;
  }
`;

const userParticipationStatus = css`
  padding: 0 10px;

  @media (max-width: 768px) {
    padding: 10px 0;
  }
`;

const statusSelect = css`
  width: 150px;
`;

const meetingDateEntry = css`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  width: 200px;
`;

const meetingInfoRow = css`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  margin-top: 10px;

  @media (max-width: 768px) {
    flex-wrap: wrap;
  }
`;

const meetingLocation = css`
  padding: 0 10px;

  @media (max-width: 768px) {
    padding: 0;
  }
`;

const meetingLocationText = css`
  padding-left: 5px;

  @media (max-width: 768px) {
    padding-left: 0;
  }
`;

const meetingMemberList = css`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

const memberListAvatar = css`
  margin: 0 5px;
`;

const meetingStatusSelect = css`
  margin-left: 10px;
  min-width: 120px;

  @media (max-width: 768px) {
    margin-left: 0;
  }
`;

const meetingDescriptionInput = css`
  margin-top: 20px;

  @media (max-width: 768px) {
    margin-top: 10px;
  }
`;

const meetingPlaceSelect = css`
  min-width: 250px;
`;

const meetingEditButton = css`
  position: absolute;
  top: 65px;
  right: 10px;

  @media (max-width: 768px) {
    position: fixed;
    bottom: 20px;
    right: 10px;
    top: unset;
  }
`;

const meetingDateInputs = css`
  display: flex;
  gap: 10px;
`;

const meetingDescription = css`
  @media (max-width: 768px) {
    margin: 10px 0;
  }
`;

export default {
  meetingPageHeader,
  meetingTitleRow,
  meetingTitleText,
  meetingTitle,
  userParticipationStatus,
  statusSelect,
  meetingDateEntry,
  meetingInfoRow,
  meetingLocation,
  meetingLocationText,
  meetingMemberList,
  memberListAvatar,
  meetingStatusSelect,
  meetingDescriptionInput,
  meetingPlaceSelect,
  meetingEditButton,
  meetingDateInputs,
  meetingDescription,
};
