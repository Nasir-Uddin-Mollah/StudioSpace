export interface WishlistItem {
  _id?: string;
  studioId: string;
  userEmail: string;
  title: string;
  category: string;
  location: string;
  image: string;
  images?: string[];
  hourlyRate: number;
  securityDeposit?: number;
  maxCapacity?: number;
  rating?: number;
  totalReviews?: number;
  description?: string;
  savedAt?: string | Date;
}

