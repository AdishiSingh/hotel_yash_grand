export interface GalleryItem {
  id: string;
  title: string;
  category: "hotel" | "rooms" | "restaurant" | "banquet" | "food" | "videos";
  mediaType: "image" | "video";
  image: string;
  thumbnail: string;
  video?: string;
  featured: boolean;
  alt: string;
}

export const GALLERY_ITEMS: GalleryItem[] = [
  {
    "id": "gallery-1",
    "title": "Hotel Detail 11",
    "category": "hotel",
    "mediaType": "image",
    "image": "/assets/outside view/WhatsApp Image 2026-07-11 at 11.26.29-11.jpeg",
    "thumbnail": "/assets/outside view/WhatsApp Image 2026-07-11 at 11.26.29-11.jpeg",
    "featured": true,
    "alt": "Hotel Detail 11 at Hotel Yash Grand Varanasi"
  },
  {
    "id": "gallery-2",
    "title": "Hotel Detail 12",
    "category": "hotel",
    "mediaType": "image",
    "image": "/assets/outside view/WhatsApp Image 2026-07-11 at 11.26.29-12.jpeg",
    "thumbnail": "/assets/outside view/WhatsApp Image 2026-07-11 at 11.26.29-12.jpeg",
    "featured": true,
    "alt": "Hotel Detail 12 at Hotel Yash Grand Varanasi"
  },
  {
    "id": "gallery-3",
    "title": "Hotel Detail 3",
    "category": "hotel",
    "mediaType": "image",
    "image": "/assets/outside view/WhatsApp Image 2026-07-11 at 11.26.29-3.jpeg",
    "thumbnail": "/assets/outside view/WhatsApp Image 2026-07-11 at 11.26.29-3.jpeg",
    "featured": true,
    "alt": "Hotel Detail 3 at Hotel Yash Grand Varanasi"
  },
  {
    "id": "gallery-4",
    "title": "Hotel Detail 4",
    "category": "hotel",
    "mediaType": "image",
    "image": "/assets/outside view/WhatsApp Image 2026-07-11 at 11.26.29-4.jpeg",
    "thumbnail": "/assets/outside view/WhatsApp Image 2026-07-11 at 11.26.29-4.jpeg",
    "featured": true,
    "alt": "Hotel Detail 4 at Hotel Yash Grand Varanasi"
  },
  {
    "id": "gallery-5",
    "title": "Hotel Detail 5",
    "category": "hotel",
    "mediaType": "image",
    "image": "/assets/outside view/WhatsApp Image 2026-07-11 at 11.26.29-5.jpeg",
    "thumbnail": "/assets/outside view/WhatsApp Image 2026-07-11 at 11.26.29-5.jpeg",
    "featured": true,
    "alt": "Hotel Detail 5 at Hotel Yash Grand Varanasi"
  },
  {
    "id": "gallery-6",
    "title": "Hotel Detail 6",
    "category": "hotel",
    "mediaType": "image",
    "image": "/assets/outside view/WhatsApp Image 2026-07-11 at 11.26.29-6.jpeg",
    "thumbnail": "/assets/outside view/WhatsApp Image 2026-07-11 at 11.26.29-6.jpeg",
    "featured": false,
    "alt": "Hotel Detail 6 at Hotel Yash Grand Varanasi"
  },
  {
    "id": "gallery-7",
    "title": "Hotel Detail 9",
    "category": "hotel",
    "mediaType": "image",
    "image": "/assets/outside view/WhatsApp Image 2026-07-11 at 11.26.29-9.jpeg",
    "thumbnail": "/assets/outside view/WhatsApp Image 2026-07-11 at 11.26.29-9.jpeg",
    "featured": false,
    "alt": "Hotel Detail 9 at Hotel Yash Grand Varanasi"
  },
  {
    "id": "gallery-8",
    "title": "Hotel Panning Video 2",
    "category": "videos",
    "mediaType": "video",
    "image": "",
    "thumbnail": "",
    "video": "/assets/outside view/WhatsApp Video 2026-07-11 at 11.26.30-2.mp4",
    "featured": false,
    "alt": "Hotel Panning Video 2 at Hotel Yash Grand Varanasi"
  },
  {
    "id": "gallery-9",
    "title": "Hotel Panning Video 2",
    "category": "videos",
    "mediaType": "video",
    "image": "",
    "thumbnail": "",
    "video": "/assets/outside view/WhatsApp Video 2026-07-11 at 11.26.32-2.mp4",
    "featured": false,
    "alt": "Hotel Panning Video 2 at Hotel Yash Grand Varanasi"
  },
  {
    "id": "gallery-10",
    "title": "Hotel Panning Video 3",
    "category": "videos",
    "mediaType": "video",
    "image": "",
    "thumbnail": "",
    "video": "/assets/outside view/WhatsApp Video 2026-07-11 at 11.26.32-3.mp4",
    "featured": false,
    "alt": "Hotel Panning Video 3 at Hotel Yash Grand Varanasi"
  },
  {
    "id": "gallery-11",
    "title": "Hotel Detail 6",
    "category": "hotel",
    "mediaType": "image",
    "image": "/assets/outside gallery/WhatsApp Image 2026-07-11 at 11.26.27-6.jpeg",
    "thumbnail": "/assets/outside gallery/WhatsApp Image 2026-07-11 at 11.26.27-6.jpeg",
    "featured": false,
    "alt": "Hotel Detail 6 at Hotel Yash Grand Varanasi"
  },
  {
    "id": "gallery-12",
    "title": "Hotel Detail 2",
    "category": "hotel",
    "mediaType": "image",
    "image": "/assets/outside gallery/WhatsApp Image 2026-07-11 at 11.26.29-2.jpeg",
    "thumbnail": "/assets/outside gallery/WhatsApp Image 2026-07-11 at 11.26.29-2.jpeg",
    "featured": false,
    "alt": "Hotel Detail 2 at Hotel Yash Grand Varanasi"
  },
  {
    "id": "gallery-13",
    "title": "Hotel Showcase #13",
    "category": "hotel",
    "mediaType": "image",
    "image": "/assets/outside gallery/WhatsApp Image 2026-07-11 at 11.30.08.jpeg",
    "thumbnail": "/assets/outside gallery/WhatsApp Image 2026-07-11 at 11.30.08.jpeg",
    "featured": false,
    "alt": "Hotel Showcase #13 at Hotel Yash Grand Varanasi"
  },
  {
    "id": "gallery-14",
    "title": "Hotel Showcase #14",
    "category": "videos",
    "mediaType": "video",
    "image": "",
    "thumbnail": "",
    "video": "/assets/outside gallery/WhatsApp Video 2026-07-11 at 11.26.32.mp4",
    "featured": false,
    "alt": "Hotel Showcase #14 at Hotel Yash Grand Varanasi"
  },
  {
    "id": "gallery-15",
    "title": "Hotel Detail 2",
    "category": "rooms",
    "mediaType": "image",
    "image": "/assets/rooms/WhatsApp Image 2026-07-11 at 11.30.03-2.jpeg",
    "thumbnail": "/assets/rooms/WhatsApp Image 2026-07-11 at 11.30.03-2.jpeg",
    "featured": false,
    "alt": "Hotel Detail 2 at Hotel Yash Grand Varanasi"
  },
  {
    "id": "gallery-16",
    "title": "Rooms Showcase #16",
    "category": "rooms",
    "mediaType": "image",
    "image": "/assets/rooms/WhatsApp Image 2026-07-11 at 11.30.03.jpeg",
    "thumbnail": "/assets/rooms/WhatsApp Image 2026-07-11 at 11.30.03.jpeg",
    "featured": false,
    "alt": "Rooms Showcase #16 at Hotel Yash Grand Varanasi"
  },
  {
    "id": "gallery-17",
    "title": "Hotel Detail 2",
    "category": "rooms",
    "mediaType": "image",
    "image": "/assets/rooms/WhatsApp Image 2026-07-11 at 11.30.04-2.jpeg",
    "thumbnail": "/assets/rooms/WhatsApp Image 2026-07-11 at 11.30.04-2.jpeg",
    "featured": false,
    "alt": "Hotel Detail 2 at Hotel Yash Grand Varanasi"
  },
  {
    "id": "gallery-18",
    "title": "Rooms Showcase #18",
    "category": "rooms",
    "mediaType": "image",
    "image": "/assets/rooms/WhatsApp Image 2026-07-11 at 11.30.04.jpeg",
    "thumbnail": "/assets/rooms/WhatsApp Image 2026-07-11 at 11.30.04.jpeg",
    "featured": false,
    "alt": "Rooms Showcase #18 at Hotel Yash Grand Varanasi"
  },
  {
    "id": "gallery-19",
    "title": "Hotel Detail 2",
    "category": "rooms",
    "mediaType": "image",
    "image": "/assets/rooms/WhatsApp Image 2026-07-11 at 11.30.08-2.jpeg",
    "thumbnail": "/assets/rooms/WhatsApp Image 2026-07-11 at 11.30.08-2.jpeg",
    "featured": false,
    "alt": "Hotel Detail 2 at Hotel Yash Grand Varanasi"
  },
  {
    "id": "gallery-20",
    "title": "Hotel Detail 2",
    "category": "rooms",
    "mediaType": "image",
    "image": "/assets/rooms/WhatsApp Image 2026-07-11 at 11.30.09-2.jpeg",
    "thumbnail": "/assets/rooms/WhatsApp Image 2026-07-11 at 11.30.09-2.jpeg",
    "featured": false,
    "alt": "Hotel Detail 2 at Hotel Yash Grand Varanasi"
  },
  {
    "id": "gallery-21",
    "title": "Rooms Showcase #21",
    "category": "rooms",
    "mediaType": "image",
    "image": "/assets/rooms/WhatsApp Image 2026-07-11 at 11.30.09.jpeg",
    "thumbnail": "/assets/rooms/WhatsApp Image 2026-07-11 at 11.30.09.jpeg",
    "featured": false,
    "alt": "Rooms Showcase #21 at Hotel Yash Grand Varanasi"
  },
  {
    "id": "gallery-22",
    "title": "Rooms Showcase #22",
    "category": "rooms",
    "mediaType": "image",
    "image": "/assets/rooms/WhatsApp Image 2026-07-11 at 11.30.10.jpeg",
    "thumbnail": "/assets/rooms/WhatsApp Image 2026-07-11 at 11.30.10.jpeg",
    "featured": false,
    "alt": "Rooms Showcase #22 at Hotel Yash Grand Varanasi"
  },
  {
    "id": "gallery-23",
    "title": "Rooms Showcase #23",
    "category": "videos",
    "mediaType": "video",
    "image": "",
    "thumbnail": "",
    "video": "/assets/rooms/WhatsApp Video 2026-07-11 at 11.30.22.mp4",
    "featured": false,
    "alt": "Rooms Showcase #23 at Hotel Yash Grand Varanasi"
  },
  {
    "id": "gallery-24",
    "title": "Rooms Showcase #24",
    "category": "videos",
    "mediaType": "video",
    "image": "",
    "thumbnail": "",
    "video": "/assets/rooms/WhatsApp Video 2026-07-11 at 11.30.26.mp4",
    "featured": false,
    "alt": "Rooms Showcase #24 at Hotel Yash Grand Varanasi"
  },
  {
    "id": "gallery-25",
    "title": "Rooms Showcase #25",
    "category": "videos",
    "mediaType": "video",
    "image": "",
    "thumbnail": "",
    "video": "/assets/rooms/WhatsApp Video 2026-07-11 at 11.30.28.mp4",
    "featured": false,
    "alt": "Rooms Showcase #25 at Hotel Yash Grand Varanasi"
  },
  {
    "id": "gallery-26",
    "title": "Rooms Showcase #26",
    "category": "videos",
    "mediaType": "video",
    "image": "",
    "thumbnail": "",
    "video": "/assets/rooms/WhatsApp Video 2026-07-11 at 11.30.29.mp4",
    "featured": false,
    "alt": "Rooms Showcase #26 at Hotel Yash Grand Varanasi"
  },
  {
    "id": "gallery-27",
    "title": "Rooms Showcase #27",
    "category": "videos",
    "mediaType": "video",
    "image": "",
    "thumbnail": "",
    "video": "/assets/rooms/WhatsApp Video 2026-07-11 at 11.30.30.mp4",
    "featured": false,
    "alt": "Rooms Showcase #27 at Hotel Yash Grand Varanasi"
  },
  {
    "id": "gallery-28",
    "title": "Rooms Showcase #28",
    "category": "videos",
    "mediaType": "video",
    "image": "",
    "thumbnail": "",
    "video": "/assets/rooms/WhatsApp Video 2026-07-11 at 11.30.31.mp4",
    "featured": false,
    "alt": "Rooms Showcase #28 at Hotel Yash Grand Varanasi"
  },
  {
    "id": "gallery-29",
    "title": "rooms",
    "category": "videos",
    "mediaType": "video",
    "image": "",
    "thumbnail": "",
    "video": "/assets/rooms/rooms.mp4",
    "featured": false,
    "alt": "rooms at Hotel Yash Grand Varanasi"
  },
  {
    "id": "gallery-30",
    "title": "Hotel Detail 6",
    "category": "restaurant",
    "mediaType": "image",
    "image": "/assets/restaurant/WhatsApp Image 2026-07-10 at 21.12.16-6.jpeg",
    "thumbnail": "/assets/restaurant/WhatsApp Image 2026-07-10 at 21.12.16-6.jpeg",
    "featured": false,
    "alt": "Hotel Detail 6 at Hotel Yash Grand Varanasi"
  },
  {
    "id": "gallery-31",
    "title": "Hotel Detail 2",
    "category": "restaurant",
    "mediaType": "image",
    "image": "/assets/restaurant/WhatsApp Image 2026-07-10 at 21.12.17-2.jpeg",
    "thumbnail": "/assets/restaurant/WhatsApp Image 2026-07-10 at 21.12.17-2.jpeg",
    "featured": false,
    "alt": "Hotel Detail 2 at Hotel Yash Grand Varanasi"
  },
  {
    "id": "gallery-32",
    "title": "Hotel Detail 4",
    "category": "restaurant",
    "mediaType": "image",
    "image": "/assets/restaurant/WhatsApp Image 2026-07-10 at 21.12.17-4.jpeg",
    "thumbnail": "/assets/restaurant/WhatsApp Image 2026-07-10 at 21.12.17-4.jpeg",
    "featured": false,
    "alt": "Hotel Detail 4 at Hotel Yash Grand Varanasi"
  },
  {
    "id": "gallery-33",
    "title": "Hotel Detail 5",
    "category": "restaurant",
    "mediaType": "image",
    "image": "/assets/restaurant/WhatsApp Image 2026-07-10 at 21.12.17-5.jpeg",
    "thumbnail": "/assets/restaurant/WhatsApp Image 2026-07-10 at 21.12.17-5.jpeg",
    "featured": false,
    "alt": "Hotel Detail 5 at Hotel Yash Grand Varanasi"
  },
  {
    "id": "gallery-34",
    "title": "Restaurant Showcase #34",
    "category": "restaurant",
    "mediaType": "image",
    "image": "/assets/restaurant/WhatsApp Image 2026-07-10 at 21.12.17.jpeg",
    "thumbnail": "/assets/restaurant/WhatsApp Image 2026-07-10 at 21.12.17.jpeg",
    "featured": false,
    "alt": "Restaurant Showcase #34 at Hotel Yash Grand Varanasi"
  },
  {
    "id": "gallery-35",
    "title": "Restaurant Showcase #35",
    "category": "restaurant",
    "mediaType": "image",
    "image": "/assets/restaurant/WhatsApp Image 2026-07-11 at 07.27.23.jpeg",
    "thumbnail": "/assets/restaurant/WhatsApp Image 2026-07-11 at 07.27.23.jpeg",
    "featured": false,
    "alt": "Restaurant Showcase #35 at Hotel Yash Grand Varanasi"
  },
  {
    "id": "gallery-36",
    "title": "Hotel Detail 2",
    "category": "restaurant",
    "mediaType": "image",
    "image": "/assets/restaurant/WhatsApp Image 2026-07-11 at 11.26.27-2.jpeg",
    "thumbnail": "/assets/restaurant/WhatsApp Image 2026-07-11 at 11.26.27-2.jpeg",
    "featured": false,
    "alt": "Hotel Detail 2 at Hotel Yash Grand Varanasi"
  },
  {
    "id": "gallery-37",
    "title": "Hotel Detail 3",
    "category": "restaurant",
    "mediaType": "image",
    "image": "/assets/restaurant/WhatsApp Image 2026-07-11 at 11.26.27-3.jpeg",
    "thumbnail": "/assets/restaurant/WhatsApp Image 2026-07-11 at 11.26.27-3.jpeg",
    "featured": false,
    "alt": "Hotel Detail 3 at Hotel Yash Grand Varanasi"
  },
  {
    "id": "gallery-38",
    "title": "Hotel Detail 4",
    "category": "restaurant",
    "mediaType": "image",
    "image": "/assets/restaurant/WhatsApp Image 2026-07-11 at 11.26.27-4.jpeg",
    "thumbnail": "/assets/restaurant/WhatsApp Image 2026-07-11 at 11.26.27-4.jpeg",
    "featured": false,
    "alt": "Hotel Detail 4 at Hotel Yash Grand Varanasi"
  },
  {
    "id": "gallery-39",
    "title": "Hotel Detail 5",
    "category": "restaurant",
    "mediaType": "image",
    "image": "/assets/restaurant/WhatsApp Image 2026-07-11 at 11.26.27-5.jpeg",
    "thumbnail": "/assets/restaurant/WhatsApp Image 2026-07-11 at 11.26.27-5.jpeg",
    "featured": false,
    "alt": "Hotel Detail 5 at Hotel Yash Grand Varanasi"
  },
  {
    "id": "gallery-40",
    "title": "Hotel Panning Video 4",
    "category": "videos",
    "mediaType": "video",
    "image": "",
    "thumbnail": "",
    "video": "/assets/restaurant/WhatsApp Video 2026-07-10 at 21.12.22-4.mp4",
    "featured": false,
    "alt": "Hotel Panning Video 4 at Hotel Yash Grand Varanasi"
  },
  {
    "id": "gallery-41",
    "title": "Hotel Panning Video 6",
    "category": "videos",
    "mediaType": "video",
    "image": "",
    "thumbnail": "",
    "video": "/assets/restaurant/WhatsApp Video 2026-07-10 at 21.12.22-6.mp4",
    "featured": false,
    "alt": "Hotel Panning Video 6 at Hotel Yash Grand Varanasi"
  },
  {
    "id": "gallery-42",
    "title": "Hotel Panning Video 7",
    "category": "videos",
    "mediaType": "video",
    "image": "",
    "thumbnail": "",
    "video": "/assets/restaurant/WhatsApp Video 2026-07-10 at 21.12.22-7.mp4",
    "featured": false,
    "alt": "Hotel Panning Video 7 at Hotel Yash Grand Varanasi"
  },
  {
    "id": "gallery-43",
    "title": "Hotel Panning Video 8",
    "category": "videos",
    "mediaType": "video",
    "image": "",
    "thumbnail": "",
    "video": "/assets/restaurant/WhatsApp Video 2026-07-10 at 21.12.22-8.mp4",
    "featured": false,
    "alt": "Hotel Panning Video 8 at Hotel Yash Grand Varanasi"
  },
  {
    "id": "gallery-44",
    "title": "Restaurant Showcase #44",
    "category": "videos",
    "mediaType": "video",
    "image": "",
    "thumbnail": "",
    "video": "/assets/restaurant/WhatsApp Video 2026-07-11 at 11.26.30.mp4",
    "featured": false,
    "alt": "Restaurant Showcase #44 at Hotel Yash Grand Varanasi"
  },
  {
    "id": "gallery-45",
    "title": "Hotel Detail 2",
    "category": "banquet",
    "mediaType": "image",
    "image": "/assets/banquet/WhatsApp Image 2026-07-10 at 21.12.16-2.jpeg",
    "thumbnail": "/assets/banquet/WhatsApp Image 2026-07-10 at 21.12.16-2.jpeg",
    "featured": false,
    "alt": "Hotel Detail 2 at Hotel Yash Grand Varanasi"
  },
  {
    "id": "gallery-46",
    "title": "Banquet Showcase #46",
    "category": "banquet",
    "mediaType": "image",
    "image": "/assets/banquet/WhatsApp Image 2026-07-11 at 07.27.20.jpeg",
    "thumbnail": "/assets/banquet/WhatsApp Image 2026-07-11 at 07.27.20.jpeg",
    "featured": false,
    "alt": "Banquet Showcase #46 at Hotel Yash Grand Varanasi"
  },
  {
    "id": "gallery-47",
    "title": "Hotel Panning Video 3",
    "category": "videos",
    "mediaType": "video",
    "image": "",
    "thumbnail": "",
    "video": "/assets/banquet/WhatsApp Video 2026-07-10 at 21.12.17-3.mp4",
    "featured": false,
    "alt": "Hotel Panning Video 3 at Hotel Yash Grand Varanasi"
  },
  {
    "id": "gallery-48",
    "title": "Hotel Panning Video 5",
    "category": "videos",
    "mediaType": "video",
    "image": "",
    "thumbnail": "",
    "video": "/assets/banquet/WhatsApp Video 2026-07-10 at 21.12.17-5.mp4",
    "featured": false,
    "alt": "Hotel Panning Video 5 at Hotel Yash Grand Varanasi"
  },
  {
    "id": "gallery-49",
    "title": "Hotel Panning Video 2",
    "category": "videos",
    "mediaType": "video",
    "image": "",
    "thumbnail": "",
    "video": "/assets/banquet/WhatsApp Video 2026-07-10 at 21.12.22-2.mp4",
    "featured": false,
    "alt": "Hotel Panning Video 2 at Hotel Yash Grand Varanasi"
  },
  {
    "id": "gallery-50",
    "title": "Banquet Showcase #50",
    "category": "videos",
    "mediaType": "video",
    "image": "",
    "thumbnail": "",
    "video": "/assets/banquet/WhatsApp Video 2026-07-10 at 21.12.22.mp4",
    "featured": false,
    "alt": "Banquet Showcase #50 at Hotel Yash Grand Varanasi"
  },
  {
    "id": "gallery-51",
    "title": "Banquet Showcase #51",
    "category": "videos",
    "mediaType": "video",
    "image": "",
    "thumbnail": "",
    "video": "/assets/banquet/WhatsApp Video 2026-07-11 at 07.27.27.mp4",
    "featured": false,
    "alt": "Banquet Showcase #51 at Hotel Yash Grand Varanasi"
  },
  {
    "id": "gallery-52",
    "title": "Banquet Showcase #52",
    "category": "videos",
    "mediaType": "video",
    "image": "",
    "thumbnail": "",
    "video": "/assets/banquet/WhatsApp Video 2026-07-11 at 07.27.28.mp4",
    "featured": false,
    "alt": "Banquet Showcase #52 at Hotel Yash Grand Varanasi"
  },
  {
    "id": "gallery-53",
    "title": "banquet",
    "category": "banquet",
    "mediaType": "image",
    "image": "/assets/banquet/banquet.png",
    "thumbnail": "/assets/banquet/banquet.png",
    "featured": false,
    "alt": "banquet at Hotel Yash Grand Varanasi"
  },
  {
    "id": "gallery-54",
    "title": "banquetdecoration",
    "category": "banquet",
    "mediaType": "image",
    "image": "/assets/banquet/banquetdecoration.png",
    "thumbnail": "/assets/banquet/banquetdecoration.png",
    "featured": false,
    "alt": "banquetdecoration at Hotel Yash Grand Varanasi"
  },
  {
    "id": "gallery-55",
    "title": "banquethall",
    "category": "banquet",
    "mediaType": "image",
    "image": "/assets/banquet/banquethall.png",
    "thumbnail": "/assets/banquet/banquethall.png",
    "featured": false,
    "alt": "banquethall at Hotel Yash Grand Varanasi"
  },
  {
    "id": "gallery-56",
    "title": "emptyview",
    "category": "banquet",
    "mediaType": "image",
    "image": "/assets/banquet/emptyview.jpeg",
    "thumbnail": "/assets/banquet/emptyview.jpeg",
    "featured": false,
    "alt": "emptyview at Hotel Yash Grand Varanasi"
  },
  {
    "id": "gallery-57",
    "title": "exitgate",
    "category": "banquet",
    "mediaType": "image",
    "image": "/assets/banquet/exitgate.jpeg",
    "thumbnail": "/assets/banquet/exitgate.jpeg",
    "featured": false,
    "alt": "exitgate at Hotel Yash Grand Varanasi"
  }
];
