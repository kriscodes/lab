/** Publishes the independent PDF loading replication guide and its sharing metadata. */
import { PdfLoadingReplication } from '@/experiments/pdf-first-page/replication';
import { pageMetadata } from '@/lib/site';

export const metadata = pageMetadata(
  'Replicate the PDF loading experiment',
  'Download the original PDF pair and follow a pinned, step-by-step guide to an independent local attempt.',
  '/experiments/pdf-first-page/replicate/',
);

/** Displays the instructions for a separate, documented replication attempt. */
export default function PdfLoadingReplicationPage() {
  return <PdfLoadingReplication />;
}
