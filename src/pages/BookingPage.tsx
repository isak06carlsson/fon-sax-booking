import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getBookedTimes, createBooking, startPolling, stopPolling } from "@/integrations/api/client";
import { toast } from "sonner";
import { ChevronLeft, ChevronRight, User, Check } from "lucide-react";
import { format, addDays, isSameDay } from "date-fns";
import { sv } from "date-fns/locale";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

const STYLISTS = ["Ibbe", "Wiliam"];
const SERVICES = ["Herrklipp - 250kr", "Hår + skägg - 350kr"];
const TIME_SLOTS = [
  "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
  "12:00", "12:30", "13:00", "13:30", "14:00", "14:30",
  "15:00", "15:30", "16:00", "16:30", "17:00", "17:30",
];

const BookingPage = () => {
  const [step, setStep] = useState(1);
  const [stylist, setStylist] = useState("");
  const [service, setService] = useState("");
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [booked, setBooked] = useState(false);
  const queryClient = useQueryClient();

  const dateStr = format(selectedDate, "yyyy-MM-dd");

  const bookingsQueryEnabled = !!stylist && step >= 4;

  // Set up polling to sync bookings across tabs and devices
  useEffect(() => {
    if (!bookingsQueryEnabled) return;

    const cleanup = startPolling(() => {
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
    }, 5000);

    return () => {
      cleanup();
      stopPolling();
    };
  }, [bookingsQueryEnabled, queryClient]);

  const { data: bookings = [] } = useQuery({
    queryKey: ["bookings", stylist, dateStr],
    queryFn: async () => {
      if (!stylist) return [];
      return getBookedTimes(stylist, dateStr);
    },
    enabled: bookingsQueryEnabled,
    staleTime: 0,
    refetchInterval: bookingsQueryEnabled ? 5000 : false,
  });

  const bookMutation = useMutation({
    mutationFn: async () => {
      await createBooking({
        stylist,
        service,
        date: dateStr,
        time: selectedTime,
        customer_name: name.trim(),
        customer_phone: phone.trim(),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
      setBooked(true);
      toast.success("Bokningen är bekräftad!");
    },
    onError: (error) => {
      toast.error(error.message || "Något gick fel. Försök igen.");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) return;
    bookMutation.mutate();
  };

  if (booked) {
    return (
      <div className="min-h-screen pt-24 pb-16 px-4 flex items-center justify-center">
        <div className="text-center animate-fade-up">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
            <Check className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-2xl font-display font-semibold mb-3">Tack för din bokning!</h1>
          <p className="text-muted-foreground mb-2">
            {stylist} · {service} · {format(selectedDate, "d MMMM yyyy", { locale: sv })} · kl {selectedTime}
          </p>
          <p className="text-muted-foreground text-sm mb-8">Vi ser fram emot ditt besök.</p>
          <p className="text-muted-foreground text-sm mb-8">Vill du avboka ditt besök? Ring oss på 0739647113</p>
          <Button variant="outline" onClick={() => { setBooked(false); setStep(1); setStylist(""); setService(""); setSelectedTime(""); setName(""); setPhone(""); }}>
            Ny bokning
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-16 px-4">
      <div className="container mx-auto max-w-lg">
        <h1 className="text-3xl font-display font-semibold text-center mb-2 animate-fade-up">Boka tid</h1>
        <p className="text-muted-foreground text-center mb-10 animate-fade-up" style={{ animationDelay: "0.05s", animationFillMode: "both" }}>
          Steg {step} av 4
        </p>

        {/* Step indicators */}
        <div className="flex items-center justify-center gap-2 mb-10">
          {[1, 2, 3, 4].map((s) => (
            <div
              key={s}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                s <= step ? "bg-primary w-10" : "bg-border w-6"
              }`}
            />
          ))}
        </div>

        {/* Step 1: Choose stylist */}
        {step === 1 && (
          <div className="space-y-4 animate-fade-up">
            <h2 className="font-display text-xl font-semibold text-center mb-6">Välj frisör</h2>
            {STYLISTS.map((s) => (
              <button
                key={s}
                onClick={() => { setStylist(s); setStep(2); }}
                className="w-full flex items-center gap-4 p-5 rounded-lg border bg-card hover:border-primary/50 hover:shadow-sm transition-all duration-200 active:scale-[0.98]"
              >
                <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center shrink-0">
                  <User className="w-5 h-5 text-muted-foreground" />
                </div>
                <span className="font-medium text-foreground">{s}</span>
              </button>
            ))}
          </div>
        )}

        {/* Step 2: Choose service */}
        {step === 2 && (
          <div className="space-y-4 animate-fade-up">
            <h2 className="font-display text-xl font-semibold text-center mb-2">Välj tjänst</h2>
            <p className="text-muted-foreground text-sm text-center mb-6">Frisör: {stylist}</p>
            {SERVICES.map((s) => (
              <button
                key={s}
                onClick={() => { setService(s); setStep(3); }}
                className="w-full p-5 rounded-lg border bg-card hover:border-primary/50 hover:shadow-sm transition-all duration-200 active:scale-[0.98] text-left"
              >
                <span className="font-medium text-foreground">{s}</span>
              </button>
            ))}

            <Button variant="ghost" onClick={() => { setStep(1); setStylist(""); }} className="w-full mt-3">
              ← Tillbaka
            </Button>
          </div>
        )}

        {/* Step 3: Choose time */}
        {step === 3 && (
          <div className="animate-fade-up">
            <h2 className="font-display text-xl font-semibold text-center mb-2">Välj tid</h2>
            <p className="text-muted-foreground text-sm text-center mb-6">Frisör: {stylist} · {service}</p>

            {/* Date selector */}
            <div className="flex items-center justify-center gap-4 mb-8">
              <button
                onClick={() => setSelectedDate((d) => addDays(d, -1))}
                disabled={isSameDay(selectedDate, new Date())}
                className="p-2 rounded-full hover:bg-secondary transition-colors disabled:opacity-30"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <span className="font-medium text-sm min-w-[160px] text-center capitalize">
                {format(selectedDate, "EEEE d MMMM", { locale: sv })}
              </span>
              <button
                onClick={() => setSelectedDate((d) => addDays(d, 1))}
                className="p-2 rounded-full hover:bg-secondary transition-colors"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>

            {/* Time grid */}
            <div className="grid grid-cols-3 gap-2 mb-8">
              {TIME_SLOTS.map((time) => {
                const isBooked = bookings.includes(time);
                return (
                  <button
                    key={time}
                    disabled={isBooked}
                    onClick={() => { setSelectedTime(time); setStep(4); }}
                    className={`py-3 rounded-md text-sm font-medium transition-all duration-150 active:scale-[0.96] ${
                      isBooked
                        ? "bg-primary/15 text-primary/50 cursor-not-allowed line-through"
                        : "bg-card border hover:border-primary/50 hover:shadow-sm text-foreground"
                    }`}
                  >
                    {time}
                  </button>
                );
              })}
            </div>

            <Button variant="ghost" onClick={() => { setStep(2); setSelectedTime(""); }} className="w-full">
              ← Tillbaka
            </Button>
          </div>
        )}

        {/* Step 4: Form */}
        {step === 4 && (
          <div className="animate-fade-up">
            <h2 className="font-display text-xl font-semibold text-center mb-2">Dina uppgifter</h2>
            <p className="text-muted-foreground text-sm text-center mb-8">
              {stylist} · {service} · {format(selectedDate, "d MMMM", { locale: sv })} · kl {selectedTime}
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-sm font-medium text-foreground mb-1.5 block">Namn</label>
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ditt namn"
                  required
                  maxLength={100}
                />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground mb-1.5 block">Telefonnummer</label>
                <Input
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="07X XXX XX XX"
                  required
                  maxLength={20}
                  type="tel"
                />
              </div>

              <Button
                variant="hero"
                type="submit"
                className="w-full rounded-lg py-6"
                disabled={bookMutation.isPending}
              >
                {bookMutation.isPending ? "Bokar..." : "Bekräfta bokning"}
              </Button>
            </form>

            <Button variant="ghost" onClick={() => { setStep(3); setSelectedTime(""); }} className="w-full mt-3">
              ← Tillbaka
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingPage;
