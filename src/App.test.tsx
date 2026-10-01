import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import App from "./App";

describe("Text Slicer app", () => {
  it("keeps the action disabled until both fields contain text", async () => {
    const user = userEvent.setup();
    render(<App />);
    const sliceButton = screen.getByRole("button", { name: /slice text/i });
    expect(sliceButton).toBeDisabled();
    await user.type(screen.getByLabelText("Main text"), "Hello world");
    expect(sliceButton).toBeDisabled();
    await user.type(screen.getByLabelText("Cut list"), "world");
    expect(sliceButton).toBeEnabled();
  });

  it("slices text and renders statistics", async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.type(screen.getByLabelText("Main text"), "one two one");
    await user.type(screen.getByLabelText("Cut list"), "one");
    await user.click(screen.getByRole("button", { name: /slice text/i }));
    expect(screen.getByLabelText("Edited text")).toHaveValue("two");
    expect(screen.getByText("2", { selector: "strong" })).toBeInTheDocument();
    expect(screen.getByText(/done — removed 2 exact matches/i)).toBeInTheDocument();
  });

  it("copies the output and shows success feedback", async () => {
    const user = userEvent.setup();
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, "clipboard", { configurable: true, value: { writeText } });
    render(<App />);
    await user.type(screen.getByLabelText("Main text"), "keep remove");
    await user.type(screen.getByLabelText("Cut list"), "remove");
    await user.click(screen.getByRole("button", { name: /slice text/i }));
    await user.click(screen.getByRole("button", { name: /copy result/i }));
    expect(writeText).toHaveBeenCalledWith("keep");
    expect(screen.getByRole("button", { name: /copied/i })).toBeInTheDocument();
  });

  it("clears all fields and the result", async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.type(screen.getByLabelText("Main text"), "some text");
    await user.type(screen.getByLabelText("Cut list"), "some");
    await user.click(screen.getByRole("button", { name: /slice text/i }));
    await user.click(screen.getByRole("button", { name: /clear all/i }));
    expect(screen.getByLabelText("Main text")).toHaveValue("");
    expect(screen.getByLabelText("Cut list")).toHaveValue("");
    expect(screen.queryByLabelText("Edited text")).not.toBeInTheDocument();
  });
});
