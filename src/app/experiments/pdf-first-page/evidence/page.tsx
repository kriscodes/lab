/** Publishes the dated PDF loading evidence ledger and its sharing metadata. */
import { PdfLoadingEvidence } from '@/experiments/pdf-first-page/ledger';
import { pageMetadata } from '@/lib/site';

export const metadata = pageMetadata(
  'PDF loading evidence',
  'Round-two response-delay results, the earlier PDF loading campaign, and the audited source records.',
  '/experiments/pdf-first-page/evidence/',
);

/** Displays the reviewed PDF loading evidence and its limitations. */
export default function PdfLoadingEvidencePage() {
  return <PdfLoadingEvidence />;
}
