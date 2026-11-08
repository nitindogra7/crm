import { notFound, permanentRedirect } from "next/navigation";
import { DocsView } from "@/features/docs";
import { DOC_PAGES, findDocPage, docHref } from "@/features/docs/data/docs-data";
import { pageMetadata } from "@/shared/lib/seo";
import { BreadcrumbData } from "@/shared/components/structured-data";
type Props = { params: Promise<{ guide: string }> };
export function generateStaticParams() { return DOC_PAGES.filter(page => page.id !== "quickstart").map(page => ({ guide: page.id })); }
async function getGuide(params: Props["params"]) {
  const { guide } = await params;
  const page = findDocPage(guide);
  if (!page) notFound();
  if (page.id !== guide || guide === "quickstart") permanentRedirect(docHref(page.id));
  return page;
}
export async function generateMetadata({ params }: Props) {
  const page = await getGuide(params);
  return pageMetadata(page.title, page.description, docHref(page.id));
}
export default async function GuidePage({ params }: Props) {
  const page = await getGuide(params);
  return <><BreadcrumbData items={[{ name: "Home", path: "/" }, { name: "Documentation", path: "/docs" }, { name: page.title, path: docHref(page.id) }]} /><DocsView pageId={page.id} /></>;
}

