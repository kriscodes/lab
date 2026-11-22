import { ROUND_TWO } from './round-two-data';

export function RoundTwoResults() {
  return (
    <section id="round-two" aria-labelledby="round-two-heading">
      <p className="lr-mono lab-eyebrow">ROUND TWO</p>
      <h2 id="round-two-heading">{ROUND_TWO.headline}</h2>
      <p className="lab-dateline">
        <time dateTime="2026-11-21">November 21, 2026</time>
      </p>
      <div className="lab-prose">
        <p>{ROUND_TWO.summary}</p>
        <p>
          We used the same two 100-page PDFs, with range loading enabled and disabled. Each delay
          went first in two of the four run pairs. The shared body cap was 1 Mbit/s throughout. Both
          dry-run calibrations passed before any PDF timings were collected.
        </p>
      </div>
      <table className="lab-ledger">
        <caption>{ROUND_TWO.tableCaption}</caption>
        <thead>
          <tr>
            <th scope="col">Run pair</th>
            <th scope="col">0 ms header delay</th>
            <th scope="col">100 ms header delay</th>
          </tr>
        </thead>
        <tbody>
          {ROUND_TWO.pairs.map(({ pair, delay0, delay100 }) => (
            <tr key={pair}>
              <th scope="row">{pair}</th>
              <td data-label="0 ms header delay">{delay0}</td>
              <td data-label="100 ms header delay">{delay100}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="lab-prose">
        <p>{ROUND_TWO.interpretation}</p>
        <p>{ROUND_TWO.network}</p>
        <p>
          These timings describe first-page canvas render in PDF.js on one machine using synthetic
          delivery. The configured header delay applies to each PDF response.
        </p>
        <a className="lab-text-link" href={ROUND_TWO.evidenceUrl}>
          Read the protocol and audited results
        </a>
      </div>
    </section>
  );
}
