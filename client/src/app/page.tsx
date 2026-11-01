import type { Metadata } from "next";
import { MarketingLandingPage } from "@/features/marketing";

export const metadata: Metadata = {
  title: "Infraly — Every enquiry, in one place",
  description: "Bring your website enquiries into one organised inbox. Keep contact details together, filter spam, and track every conversation from hello to follow-up.",
};

export default function Home() {
  return <MarketingLandingPage />;
}
