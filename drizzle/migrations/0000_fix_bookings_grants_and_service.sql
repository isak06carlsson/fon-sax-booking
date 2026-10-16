ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS service TEXT NOT NULL DEFAULT '';

GRANT SELECT, INSERT, DELETE ON public.bookings TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.bookings TO authenticated;
GRANT ALL ON public.bookings TO service_role;

CREATE POLICY "Anyone can delete bookings" ON public.bookings FOR DELETE TO anon USING (true);