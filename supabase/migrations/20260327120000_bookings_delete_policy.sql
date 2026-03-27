DROP POLICY IF EXISTS "Anyone can delete bookings" ON public.bookings;
CREATE POLICY "Anyone can delete bookings" ON public.bookings FOR DELETE USING (true);