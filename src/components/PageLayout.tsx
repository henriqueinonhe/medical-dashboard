import React from "react";
import styled from "styled-components";
import { Header } from "./Header";

const Container = styled.div`
  min-height: 100%;
  background-color: #e8ebed;
  padding-bottom: 60px;
`;

const ChildrenContainer = styled.main`
  margin-top: 40px;
`;

export interface PageLayoutProps {
  children : React.ReactNode;
}

export function PageLayout(props : PageLayoutProps) : JSX.Element {
  const {
    children
  } = props;

  return (
    <Container>
      <Header />

      <ChildrenContainer>
        {children}
      </ChildrenContainer>
    </Container>
  );
}