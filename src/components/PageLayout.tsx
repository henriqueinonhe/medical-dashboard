import React from "react";
import styled from "styled-components";

const Container = styled.div``;

export interface PageLayoutProps {
  children : React.ReactNode;
}

export function PageLayout(props : PageLayoutProps) : JSX.Element {
  const {
    children
  } = props;

  return (
    <Container>
      {children}
    </Container>
  );
}