/** Publishes the PDF loading overview at its dedicated experiment route. */
import { PdfLoadingOverview } from '@/experiments/pdf-first-page/overview';
import { pageMetadata } from '@/lib/site';

export const metadata = pageMetadata(
  'PDF loading — Lab 001',
  'One controlled PDF pair and the path to first-page render. Protocol, current evidence and limitations.',
  '/experiments/pdf-first-page/',
);

/** Displays the PDF loading study overview. */
export default function PdfLoadingOverviewPage() {
  return <PdfLoadingOverview />;
}
