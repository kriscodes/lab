import { PdfLoadingOverview } from '@/experiments/pdf-first-page/overview';
import { pageMetadata } from '@/lib/site';

export const metadata = pageMetadata(
  'PDF loading — Lab 001',
  'One controlled PDF pair and the path to first-page render. Protocol, current evidence and limitations.',
  '/experiments/pdf-first-page/',
);

export default function Page() {
  return <PdfLoadingOverview />;
}
