import { ContactView } from "@/features/contact/components/ContactView";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Directions & Contact | Hotel Yash Grand Varanasi",
  description: "Get routes and maps to Hotel Yash Grand near SMS College, Varanasi. Find distances from Varanasi Cantt station, Babatpur airport, and direct WhatsApp contact channels.",
};

export default function ContactPage() {
  return (
    <div className="min-h-screen pt-16 bg-background">
      {/* Contact & Directions details */}
      <ContactView />
    </div>
  );
}
