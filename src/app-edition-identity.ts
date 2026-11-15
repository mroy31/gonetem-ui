import { app } from "electron";
import { edition } from "./edition";

const STUDENT_APP_NAME = "gonetem-ui-student";

export function applyEditionIdentity(): string | null {
  if (edition === "student") {
    app.setName(STUDENT_APP_NAME);
    return STUDENT_APP_NAME;
  }
  return null;
}

applyEditionIdentity();
