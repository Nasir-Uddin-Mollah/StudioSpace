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

