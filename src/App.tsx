import { useEffect, useRef, useState } from "react";
import { Eraser, LockKeyhole, Scissors } from "lucide-react";
import { EditorPanel } from "./components/EditorPanel";
import { ResultPanel } from "./components/ResultPanel";
import { sliceText, type SliceResult } from "./utils/sliceText";

type Feedback = { type: "error" | "success" | "info"; message: string } | null;

async function copyToClipboard(value: string): Promise<void> {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(value);
    return;
  }

  const temporary = document.createElement("textarea");
  temporary.value = value;
  temporary.style.position = "fixed";
  temporary.style.opacity = "0";
  document.body.appendChild(temporary);
  temporary.select();
  const successful = document.execCommand("copy");
  temporary.remove();
  if (!successful) throw new Error("Copy command failed");
}

export default function App() {
  const [source, setSource] = useState("");
  const [removalInput, setRemovalInput] = useState("");
  const [result, setResult] = useState<SliceResult | null>(null);
  const [feedback, setFeedback] = useState<Feedback>(null);
  const [copied, setCopied] = useState(false);
  const copyTimer = useRef<number | undefined>(undefined);

  const canSlice = source.trim().length > 0 && removalInput.trim().length > 0;

  useEffect(() => () => window.clearTimeout(copyTimer.current), []);

  function handleSlice() {
    if (!source.trim()) {
      setFeedback({ type: "error", message: "Add the main text you want to edit." });
      return;
    }
    if (!removalInput.trim()) {
      setFeedback({ type: "error", message: "Add at least one word or phrase to remove." });
      return;
    }

    const nextResult = sliceText(source, removalInput);
    setResult(nextResult);
    setCopied(false);
    setFeedback({
      type: nextResult.removedMatches > 0 ? "success" : "info",
      message: nextResult.removedMatches > 0
        ? `Done — removed ${nextResult.removedMatches} exact ${nextResult.removedMatches === 1 ? "match" : "matches"}.`
        : "No exact matches were found. Your original text was kept.",
    });
    requestAnimationFrame(() => document.getElementById("result-title")?.focus?.());
  }

  function handleClear() {
    setSource("");
    setRemovalInput("");
    setResult(null);
    setCopied(false);
    setFeedback(null);
    document.getElementById("source-text")?.focus();
  }

  async function handleCopy() {
    if (!result?.output) return;
    try {
      await copyToClipboard(result.output);
      setCopied(true);
      setFeedback({ type: "success", message: "Result copied to your clipboard." });
      window.clearTimeout(copyTimer.current);
      copyTimer.current = window.setTimeout(() => setCopied(false), 2200);
    } catch {
      setFeedback({ type: "error", message: "Copying failed. Select the result and copy it manually." });
    }
  }

  return (
    <div className="app-shell">
      <header className="site-header">
        <a className="wordmark" href="#top" aria-label="Text Slicer home">
          <span className="wordmark__mark"><Scissors aria-hidden="true" /></span>
          <span>Text Slicer</span>
        </a>
        <a className="header-link" href="#how-it-works">How it works <span aria-hidden="true">↓</span></a>
      </header>

      <main id="top">
        <section className="intro" aria-labelledby="page-title">
          <p className="kicker"><span /> Private, precise text editing</p>
          <h1 id="page-title">Cut the words.<br /><em>Keep the meaning.</em></h1>
          <p className="intro__body">Paste your text, list what needs to go, and get a clean version in seconds. Exact matches only—nothing unexpected.</p>
          <div className="intro__note"><LockKeyhole aria-hidden="true" /> Your text stays on this device</div>
        </section>

        <div className="editor-grid" id="how-it-works">
          <EditorPanel
            id="source-text"
            eyebrow="01 / Source"
            title="Main text"
            hint="Paste any paragraph, article, or draft."
            value={source}
            onChange={setSource}
            placeholder="Paste the text you want to clean…"
          />
          <EditorPanel
            id="removal-text"
            eyebrow="02 / Remove"
            title="Cut list"
            hint="One case-sensitive word or phrase per line."
            value={removalInput}
            onChange={setRemovalInput}
            placeholder={"unwanted word\na phrase to remove\nanother exact match"}
            variant="remove"
          />
        </div>

        <div className="action-row">
          <p>Matches are exact and case-sensitive.</p>
          <div className="action-row__buttons">
            <button className="button button--clear" type="button" onClick={handleClear} disabled={!source && !removalInput}>
              <Eraser aria-hidden="true" /> Clear all
            </button>
            <button className="button button--primary" type="button" onClick={handleSlice} disabled={!canSlice}>
              <Scissors aria-hidden="true" /> Slice text
            </button>
          </div>
        </div>

        <div className="feedback-slot" aria-live="polite" aria-atomic="true">
          {feedback && <p className={`feedback feedback--${feedback.type}`}>{feedback.message}</p>}
        </div>

        <ResultPanel result={result} copied={copied} onCopy={handleCopy} />

        <footer className="privacy-note">
          <LockKeyhole aria-hidden="true" />
          <p><strong>Private by design.</strong> All text processing happens locally in your browser. Nothing is uploaded or stored.</p>
          <span>TEXT SLICER / 2026</span>
        </footer>
      </main>
    </div>
  );
}
