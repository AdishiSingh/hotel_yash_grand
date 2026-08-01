export interface LandmarkAttraction {
  id: string;
  name: string;
  distance: string;
  description: string;
}

export const NEARBY_ATTRACTIONS_DATA: LandmarkAttraction[] = [
  {
    id: "sms-college",
    name: "SMS College Varanasi",
    distance: "Adjacent (Walking distance)",
    description: "Immediate access for academic delegates and families visiting students.",
  },
  {
    id: "vishwanath-temple",
    name: "Kashi Vishwanath Temple",
    distance: "7.8 km (20 mins drive)",
    description: "The spiritual focal point of Varanasi, home to the sacred Shiva Jyotirlinga.",
  },
  {
    id: "ganga-ghats",
    name: "Dashashwamedh Ghat",
    distance: "8.2 km (22 mins drive)",
    description: "Observe the majestic evening Ganga Aarti ceremony along the riverbanks.",
  },
  {
    id: "sarnath-site",
    name: "Sarnath Buddhist Site",
    distance: "14 km (35 mins drive)",
    description: "Discover the deer park where Lord Buddha delivered his first sermon.",
  },
];
