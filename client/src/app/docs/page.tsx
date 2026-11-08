import { DocsView } from "@/features/docs";
import { pageMetadata } from "@/shared/lib/seo";
import { BreadcrumbData } from "@/shared/components/structured-data";
// Legacy query URLs are redirected in proxy before rendering, keeping this page static.
export const metadata = pageMetadata("Form backend documentation and quickstart", "Create a form endpoint, connect your website, and review your first lead. Setup guides for HTML, React, Next.js, server requests, and spam protection.", "/docs");
export default function DocsPage() {
  return <><BreadcrumbData items={[{ name: "Home", path: "/" }, { name: "Documentation", path: "/docs" }]} /><DocsView pageId="quickstart" /></>;
}
