export type StudioCategory =
  | "Photo Studio"
  | "Film Stage"
  | "Podcast Lounge"
  | "Music Suite"
  | "Workshop"
  | "Dance Rehearsal"
  | "Art Loft";

export interface Studio {
  _id?: string;
  title: string;
  category: StudioCategory | string;
  hourlyRate: number;
  securityDeposit: number;
  maxCapacity: number;
  location: string;
  image: string;
  images?: string[];
  amenities: string[];
  description: string;
  userEmail: string;
  userName: string;
  rating?: number;
  totalReviews?: number;
  createdAt?: string | Date;
  updatedAt?: string | Date;
}

export interface StudioFormData {
  title: string;
  category: string;
  hourlyRate: number;
  securityDeposit: number;
  maxCapacity: number;
  location: string;
  image: string;
  images?: string[];
  amenities: string[];
  description: string;
  userEmail: string;
  userName: string;
}

export interface StudioApiResponse {
  success: boolean;
  message?: string;
  data?: Studio | Studio[];
  insertedId?: string;
}

export interface Review {
  id: string;
  author: string;
  avatar?: string;
  rating: number;
  date: string;
  comment: string;
  shootType: string;
}

export interface BookingRequest {
  studioId: string;
  studioTitle: string;
  hourlyRate: number;
  securityDeposit: number;
  date: string;
  startTime: string;
  hours: number;
  crewSize: number;
  totalPrice: number;
  notes?: string;
  userEmail: string;
  userName: string;
}

