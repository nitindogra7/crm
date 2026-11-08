import { MarketingLandingPage } from "@/features/marketing";
import { pageMetadata } from "@/shared/lib/seo";
import { SiteStructuredData } from "@/shared/components/structured-data";
export const metadata = pageMetadata("Form backend and website lead management", "Connect HTML, React, and Next.js forms to Infraly. Capture enquiries, review spam, and manage lead statuses in one inbox without building a form backend.", "/");
export default function Home() { return <><SiteStructuredData /><MarketingLandingPage /></>; }
