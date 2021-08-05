import React from "react";
import { Link, useLocation } from "react-router-dom";
import styled from "styled-components";

const Container = styled.header`
  background-color: white;
  min-width: 700px;
  max-width: 1000px;
  width: 70vw;
  margin: auto;
  padding: 24px;
  background-color: white;
  border-radius: 3px;
`;

const NavLinkList = styled.div`
  display: flex;
`;

interface NavLinkProps {
  active : boolean;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const NavLink = styled(({active, ...props}) => <Link {...props} />)<NavLinkProps>`
  margin-left: 20px;
  padding: 12px;
  border-radius: 4px;
  text-decoration: none;
  font-family: 18px;

  background-color: ${props => props.active ? "#4a7dff" : "transparent"};
  color: ${props => props.active ? "white" : "initial"};
`;

export const Header = React.memo(() => {
  const location = useLocation();

  return (
    <Container>
      <NavLinkList>
        <NavLink
          to="/dashboard/calendar"
          active={location.pathname === "/dashboard/calendar"}
        >
          Calendar
        </NavLink>

        <NavLink
          to="/dashboard/history"
          active={location.pathname === "/dashboard/history"}
        >
          History
        </NavLink>

        <NavLink
          to="/dashboard/patients"
          active={location.pathname === "/dashboard/patients"}
        >
          Patients
        </NavLink>
      </NavLinkList>
    </Container>
  );
});

Header.displayName = "Header";