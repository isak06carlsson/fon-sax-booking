// Booking data client — backed by Lovable Cloud database

import { supabase } from "@/integrations/supabase/client";

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

// Get booked times for a stylist on a specific date
export const getBookedTimes = async (stylist: string, date: string): Promise<string[]> => {
  const { data, error } = await supabase
    .from("bookings")
    .select("time")
    .eq("stylist", stylist)
    .eq("date", date);

  if (error) throw new Error(error.message);
  return (data ?? []).map((row) => row.time);
};

// Create a new booking
export const createBooking = async (booking: CreateBookingInput): Promise<Booking> => {
  const { data, error } = await supabase
    .from("bookings")
    .insert(booking)
    .select()
    .single();

  if (error) {
    if (error.code === "23505") {
      throw new Error("Tiden är tyvärr redan bokad. Välj en annan tid.");
    }
    throw new Error(error.message);
  }
  return data;
};

// Get all bookings (for admin)
export const getAllBookings = async (): Promise<Booking[]> => {
  const { data, error } = await supabase
    .from("bookings")
    .select("*")
    .order("date", { ascending: true })
    .order("time", { ascending: true });

  if (error) throw new Error(error.message);
  return data ?? [];
};

// Delete a booking
export const deleteBooking = async (id: string): Promise<void> => {
  const { error } = await supabase.from("bookings").delete().eq("id", id);
  if (error) throw new Error(error.message);
};

// Subscribe to booking changes (real-time)
export const startPolling = (
  callback: (bookings?: Booking[]) => void,
  _intervalMs: number = 5000
): (() => void) => {
  const channel = supabase
    .channel("bookings-changes")
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: "bookings" },
      () => callback()
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
};

export const stopPolling = () => {
  // No-op: channels are cleaned up via the function returned by startPolling
};
