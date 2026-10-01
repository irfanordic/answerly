import { Check, Copy, Scissors } from "lucide-react";
import type { SliceResult } from "../utils/sliceText";

interface ResultPanelProps {
  result: SliceResult | null;
  copied: boolean;
  onCopy: () => void;
}

export function ResultPanel({ result, copied, onCopy }: ResultPanelProps) {
  const output = result?.output ?? "";

  return (
    <section className={`result-panel${result ? " result-panel--ready" : ""}`} aria-labelledby="result-title">
      <div className="result-panel__header">
        <div>
          <p className="eyebrow">Your edit</p>
          <h2 id="result-title" tabIndex={-1}>Clean result</h2>
        </div>
        {result && (
          <div className="result-stats" aria-label="Result statistics">
            <span><strong>{result.removedMatches}</strong> matches removed</span>
            <span><strong>{output.length.toLocaleString()}</strong> characters</span>
          </div>
        )}
      </div>

      {result ? (
        <>
          <label className="sr-only" htmlFor="result-output">Edited text</label>
          <textarea id="result-output" className="result-output" value={output} readOnly />
          <div className="result-panel__footer">
            <p>{result.removedTerms} unique {result.removedTerms === 1 ? "term" : "terms"} checked</p>
            <button className={`button button--copy${copied ? " is-copied" : ""}`} onClick={onCopy} disabled={!output}>
              {copied ? <Check aria-hidden="true" /> : <Copy aria-hidden="true" />}
              {copied ? "Copied" : "Copy result"}
            </button>
          </div>
        </>
      ) : (
        <div className="result-empty">
          <Scissors aria-hidden="true" />
          <p>Your sliced text will appear here.</p>
          <span>Nothing leaves your browser.</span>
        </div>
      )}
    </section>
  );
}
