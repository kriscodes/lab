/** Copy is optional; the complete command remains selectable without JavaScript or clipboard access. */
'use client';

import { useState } from 'react';

/** Present a selectable replication command with optional clipboard copying and feedback. */
export function CommandBlock({ label, command }: { label: string; command: string }) {
  const [copyFeedback, setCopyFeedback] = useState('');

  /** Copy the command, or explain the manual fallback when clipboard access is unavailable. */
  async function copyCommand() {
    try {
      await navigator.clipboard.writeText(command);
      setCopyFeedback('Copied to clipboard.');
    } catch {
      setCopyFeedback('Select and copy the command below. Clipboard access is unavailable.');
    }
  }
  return (
    <div className="lab-command">
      <div className="lab-command-heading">
        <span>{label}</span>
        <button type="button" onClick={copyCommand} aria-label={`Copy ${label}`}>
          Copy
        </button>
      </div>
      <pre tabIndex={0} aria-label={label}>
        <code>{command}</code>
      </pre>
      <p className="lab-copy-feedback" role="status">
        {copyFeedback}
      </p>
    </div>
  );
}
