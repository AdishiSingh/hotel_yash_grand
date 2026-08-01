export interface ContactDetails {
  name: string;
  address: string;
  landmark: string;
  city: string;
  state: string;
  zipCode: string;
  phones: string[];
  whatsapp: string;
  email: string;
  businessHours: string;
  emergencyPhone: string;
  parkingInfo: string;
  googleMapsEmbed: string;
  googleMapsDirections: string;
  socials: {
    facebook?: string;
    instagram?: string;
    twitter?: string;
  };
}

export const CONTACT_DATA: ContactDetails = {
  name: "HOTEL YASH GRAND",
  address: "Near SMS College, Varanasi, Uttar Pradesh",
  landmark: "Near SMS College",
  city: "Varanasi",
  state: "Uttar Pradesh",
  zipCode: "221011",
  phones: [
    "+91 91510 88115",
    "+91 91510 88116"
  ],
  whatsapp: "+919151088115",
  email: "yashgrand03nov@gmail.com",
  businessHours: "24/7 Reception & Front Desk Coverage",
  emergencyPhone: "+91 91510 88115",
  parkingInfo: "Complimentary secure valet parking inside hotel premises for all guests.",
  // Grayscale styled interactive Google Maps embed
  googleMapsEmbed: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3608.3787720919323!2d82.9739144!3d25.2921008!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x398e330a103328e1%3A0xea80277bd2b528be!2sHotel%20Yash%20Grand!5e0!3m2!1sen!2sin!4v1689400000000!5m2!1sen!2sin",
  googleMapsDirections: "https://maps.app.goo.gl/fK8jYv7HqgQ2Dk2V7",
  socials: {
    facebook: "https://facebook.com/hotelyashgrand",
    instagram: "https://instagram.com/hotelyashgrand"
  }
};
