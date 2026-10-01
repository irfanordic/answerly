export interface SliceResult {
  output: string;
  removedMatches: number;
  removedTerms: number;
}

export function parseRemovalTerms(value: string): string[] {
  return [...new Set(value.split(/\r?\n/).map((term) => term.trim()).filter(Boolean))];
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export function cleanWhitespace(value: string): string {
  return value
    .replace(/[^\S\r\n]+/g, " ")
    .replace(/[ \t]+$/gm, "")
    .replace(/(?:\r?\n){3,}/g, "\n\n")
    .trim();
}

export function sliceText(source: string, removalInput: string): SliceResult {
  const terms = parseRemovalTerms(removalInput).sort((a, b) => b.length - a.length);

  if (terms.length === 0) {
    return { output: cleanWhitespace(source), removedMatches: 0, removedTerms: 0 };
  }

  const matcher = new RegExp(terms.map(escapeRegExp).join("|"), "gu");
  let removedMatches = 0;
  const output = source.replace(matcher, () => {
    removedMatches += 1;
    return "";
  });

  return {
    output: cleanWhitespace(output),
    removedMatches,
    removedTerms: terms.length,
  };
}
