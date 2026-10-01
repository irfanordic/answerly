import { describe, expect, it } from "vitest";
import { cleanWhitespace, parseRemovalTerms, sliceText } from "./sliceText";

describe("sliceText", () => {
  it("removes every exact occurrence and reports counts", () => {
    expect(sliceText("red blue red", "red")).toEqual({
      output: "blue",
      removedMatches: 2,
      removedTerms: 1,
    });
  });

  it("supports multiple terms while ignoring empty and duplicate lines", () => {
    expect(sliceText("alpha beta gamma", " beta \n\nalpha\nbeta")).toEqual({
      output: "gamma",
      removedMatches: 2,
      removedTerms: 2,
    });
  });

  it("is case-sensitive", () => {
    expect(sliceText("Text text TEXT", "text").output).toBe("Text TEXT");
  });

  it("treats regex punctuation literally", () => {
    expect(sliceText("Keep dots... and (brackets) plus a*b.", ".\n(\n)\na*b")).toEqual({
      output: "Keep dots and brackets plus",
      removedMatches: 7,
      removedTerms: 4,
    });
  });

  it("prefers longer overlapping terms", () => {
    expect(sliceText("answer parser", "answer\nanswer parser").output).toBe("");
  });

  it("handles unicode and a fully removed source", () => {
    expect(sliceText("नमस्ते 🌍 नमस्ते", "नमस्ते\n🌍").output).toBe("");
  });
});

describe("input and whitespace helpers", () => {
  it("trims and deduplicates terms", () => {
    expect(parseRemovalTerms(" one \n two\none\n")).toEqual(["one", "two"]);
  });

  it("lightly cleans whitespace while preserving paragraphs", () => {
    expect(cleanWhitespace("  Hello    world  \n\n\n\nNext   paragraph  ")).toBe("Hello world\n\nNext paragraph");
  });
});
