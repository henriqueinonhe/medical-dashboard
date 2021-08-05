import React from "react";
import styled from "styled-components";
import { Spinner } from "./Spinner";

const Container = styled.div`
  display: flex;
  width: 100%;
  height: 100vh;
  justify-content: center;
  align-items: center;
  transform: scale(1.7);
`;

export interface SpinnerWrapperProps {
  isLoading : boolean;
  children : React.ReactNode;
}

export function SpinnerWrapper(props : SpinnerWrapperProps) : JSX.Element {
  const {
    isLoading,
    children
  } = props;

  return (
    <>
      {
        isLoading ?
          <Container>
            <Spinner /> 
          </Container> :
          children
      }
    </>
  );
}
