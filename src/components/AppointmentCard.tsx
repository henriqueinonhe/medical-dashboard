import React from "react";
import styled from "styled-components";
import { AllowedTime, formatAllowedTime, Weekday } from "../helpers/calendarHelper";

type ContainerProps = AppointmentCardProps;

const Container = styled.div<ContainerProps>`
  grid-column-start: ${props => props.weekday};
  grid-row-start: ${props => formatAllowedTime(props.startTime)};
  grid-row-end: ${props => formatAllowedTime(props.endTime)};

  width: 100%;
  height: 100%;
  background-color: pink;
  border-radius: 3px;
  padding: 10px;
`;

export interface AppointmentCardProps {
  weekday : Weekday;
  startTime : AllowedTime;
  endTime : AllowedTime;
}

export const AppointmentCard = React.memo((props : AppointmentCardProps) => {
  const {
    weekday,
    startTime,
    endTime
  } = props;

  return (
    <Container
      {...props}
    >
      Lorem ipsum dolor sit amet, consectetur adipiscing elit
    </Container>
  );
});

AppointmentCard.displayName = "AppointmentCard";