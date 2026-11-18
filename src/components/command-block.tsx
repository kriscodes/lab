'use client';

/** Copy is optional; the complete command remains selectable without JavaScript or clipboard access. */
import { useState } from 'react';

export function CommandBlock({ label, command }: { label: string; command: string }) {
  const [feedback, setFeedback] = useState('');
  async function copyCommand() {
    try {
      await navigator.clipboard.writeText(command);
      setFeedback('Copied to clipboard.');
    } catch {
      setFeedback('Select and copy the command below. Clipboard access is unavailable.');
    }
  }
  return (
    <div className="lab-command">
      <div className="lab-command-heading">
        <span>{label}</span>
        <button type="button" onClick={copyCommand} aria-label={`Copy ${label}`}>
          Copy <span aria-hidden="true">↗</span>
        </button>
      </div>
      <pre tabIndex={0} aria-label={label}>
        <code>{command}</code>
      </pre>
      <p className="lab-copy-feedback" role="status">
        {feedback}
      </p>
    </div>
  );
}
