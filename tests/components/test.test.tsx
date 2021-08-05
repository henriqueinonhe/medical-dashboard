import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";

test("test", async () => {
  render(<div>Hello</div>);

  expect(screen.getByText("Hello")).toHaveTextContent("Hello");
});