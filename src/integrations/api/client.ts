// This replaces the Supabase client

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

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

// Get available times for a stylist on a specific date
export const getBookedTimes = async (stylist: string, date: string): Promise<string[]> => {
  const response = await fetch(`${API_URL}/bookings/stylist/${stylist}/date/${date}`);
  if (!response.ok) {
    if (response.status === 404) return [];
    throw new Error('Failed to fetch booked times');
  }
  return response.json();
};

// Create a new booking
export const createBooking = async (booking: CreateBookingInput): Promise<Booking> => {
  const response = await fetch(`${API_URL}/bookings`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(booking),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to create booking');
  }

  return response.json();
};

// Get all bookings (for admin)
export const getAllBookings = async (): Promise<Booking[]> => {
  const response = await fetch(`${API_URL}/bookings`);
  if (!response.ok) {
    throw new Error('Failed to fetch bookings');
  }
  return response.json();
};

// Delete a booking
export const deleteBooking = async (id: string): Promise<void> => {
  const response = await fetch(`${API_URL}/bookings/${id}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    throw new Error('Failed to delete booking');
  }
};

// Set up polling for real-time updates
let pollInterval: NodeJS.Timeout | null = null;

export const startPolling = (
  callback: (bookings?: Booking[]) => void,
  intervalMs: number = 5000
): (() => void) => {
  // Call immediately and then set interval
  const poll = async () => {
    try {
      const bookings = await getAllBookings();
      callback(bookings);
    } catch (error) {
      console.error('Polling error:', error);
      callback();
    }
  };

  poll();
  pollInterval = setInterval(poll, intervalMs);

  // Return cleanup function
  return () => {
    if (pollInterval) {
      clearInterval(pollInterval);
      pollInterval = null;
    }
  };
};

export const stopPolling = () => {
  if (pollInterval) {
    clearInterval(pollInterval);
    pollInterval = null;
  }
};
