import { PdfLoadingOverview } from '@/experiments/pdf-first-page/overview';
import { pageMetadata } from '@/lib/site';

export const metadata = pageMetadata(
  'Engineering Lab',
  'Independent engineering research by Kristian Salmeron. Explore the PDF loading lab, inspect its evidence and replicate the experiment.',
  '/',
);

export default function HomePage() {
  return <PdfLoadingOverview />;
}
