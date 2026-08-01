import { ASSET_MANIFEST } from "../lib/asset-manifest";

export interface BanquetEventFormat {
  id: string;
  name: string;
  tagline: string;
  capacity: string;
  description: string;
  imageUrl: string;
  videoUrl: string;
}

export interface DecorationPackage {
  name: string;
  theme: string;
  inclusion: string;
}

export const BANQUET_EVENTS: BanquetEventFormat[] = [
  {
    id: "weddings",
    name: "Weddings & Receptions",
    tagline: "Varanasi's premier wedding destination",
    capacity: "Up to 500 Guests",
    description: "Experience royal weddings in our pillar-less ballroom. From massive stage setups decorated in fresh floral arrangements to dedicated bridal preparation suites, we handle every detail with flawless grace.",
    imageUrl: ASSET_MANIFEST.banquet.stageSetup,
    videoUrl: ASSET_MANIFEST.videos.banquetStage,
  },
  {
    id: "birthdays",
    name: "Birthday Celebrations",
    tagline: "Celebrate milestones in luxury",
    capacity: "50 to 200 Guests",
    description: "Bespoke decorations, customized light scenarios, and professional audio arrays to host private anniversaries and family milestone celebrations.",
    imageUrl: ASSET_MANIFEST.banquet.banquetDecoration,
    videoUrl: ASSET_MANIFEST.videos.banquetFlowerArrangements,
  },
  {
    id: "corporate",
    name: "Corporate Seminars & Meetings",
    tagline: "Professional scale & precision",
    capacity: "Up to 300 Delegates",
    description: "Features high-ceiling wood structures for clear acoustics, state-of-the-art dimming scenarios, high-capacity LED screens, and custom microphone configurations.",
    imageUrl: ASSET_MANIFEST.banquet.ceilingArchitecture,
    videoUrl: ASSET_MANIFEST.videos.banquetEmptyHall,
  },
];

export const BANQUET_PACKAGES: DecorationPackage[] = [
  { name: "Royal Awadhi Heritage", theme: "Traditional Marigolds & Gold Arcs", inclusion: "Awadhi Catering + Stage Decor" },
  { name: "Contemporary Minimalist", theme: "White Lilies & Glass Elevations", inclusion: "Continental Catering + Ambient Lights" },
  { name: "Imperial Corporate", theme: "Acoustic Arrays & Led Displays", inclusion: "High-Tea Buffet + Technical Crew" },
];
