import React from "react";
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { edition, features } from "./edition";

describe("edition (jsdom project define)", () => {
  it("reads the full-edition defaults injected via define", () => {
    expect(edition).toBe("full");
    expect(features.optionsWrite).toBe(true);
    render(<div>{edition}</div>);
    expect(screen.getByText("full")).toBeTruthy();
  });
});
