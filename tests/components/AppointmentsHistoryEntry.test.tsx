import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import { randomAppointment } from "../../testHelpers/random";
import { AppointmentsHistoryEntry } from "../../src/components/AppointmentsHistoryEntry";
import Dayjs from "../../src/helpers/dayjs";
import { BrowserRouter } from "react-router-dom";

test("Happy path", async () => {
  const appointment = randomAppointment();

  render(
    <BrowserRouter>
      <AppointmentsHistoryEntry 
        appointment={appointment}
      />
    </BrowserRouter>
  );

  const displayableDate = Dayjs(appointment.startTime).format("MM/DD/YYYY");
  expect(screen.getByText(displayableDate)).toBeTruthy();
});