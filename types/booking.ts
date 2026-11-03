export type BookingStatus = "Pending" | "Confirmed" | "Completed" | "Cancelled";

export interface Booking {
  _id: string;
  studioId: string;
  studioTitle: string;
  studioImage?: string;
  studioCategory: string;
  studioLocation: string;
  hostEmail: string;
  hostName: string;
  userEmail: string;
  userName: string;
  date: string;
  startTime: string;
  hours: number;
  crewSize: number;
  hourlyRate: number;
  securityDeposit: number;
  totalAmount: number;
  status: BookingStatus;
  bookedAt?: string;
}

