export interface Booking {
  id: string;
  stylist: string;
  date: string;
  time: string;
  customer_name: string;
  customer_phone: string;
  created_at: string;
}

export interface CreateBookingInput {
  stylist: string;
  date: string;
  time: string;
  customer_name: string;
  customer_phone: string;
}
