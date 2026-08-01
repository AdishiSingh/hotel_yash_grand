export interface GuestReview {
  id: string;
  quote: string;
  author: string;
  origin: string;
  rating: number;
}

export const REVIEWS_DATA: GuestReview[] = [
  {
    id: "review-1",
    quote: "The interiors are beautiful. The wooden ceilings and clean marble floors make it feel like a boutique heritage hotel. Located very close to SMS College, making our family visit incredibly smooth.",
    author: "Rakesh Sharma",
    origin: "Verified Google Review",
    rating: 5,
  },
  {
    id: "review-2",
    quote: "Hosted our engagement ceremony in the Grand Ballroom. The lighting setup and sound acoustics are state-of-the-art. Our guests loved the Awadhi food spread served by the catering team.",
    author: "Aditi Misra",
    origin: "Verified Wedding Client",
    rating: 5,
  },
  {
    id: "review-3",
    quote: "Excellent multi-cuisine menu at HOTEL YASH GRAND. The signature Awadhi kebabs are tender and perfectly spiced. High hygiene standards that you can inspect yourself.",
    author: "Vikram Malhotra",
    origin: "Verified Restaurant Guest",
    rating: 5,
  },
];
