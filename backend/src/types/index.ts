export interface Booking {
  id: string;
  stylist: string;
  service: string;
  date: string;
  time: string;
  customer_name: string;
  customer_phone: string;
  created_at: string;
}

export interface CreateBookingInput {
  stylist: string;
  service: string;
  date: string;
  time: string;
  customer_name: string;
  customer_phone: string;
}

export type Service = "Herrklipp - 250kr" | "Hår + skägg - 350kr";

export const SERVICES: Service[] = [
  "Herrklipp - 250kr",
  "Hår + skägg - 350kr"
];
