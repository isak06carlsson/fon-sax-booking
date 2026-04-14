import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getAllBookings, deleteBooking, type Booking } from "@/integrations/api/client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { sv } from "date-fns/locale";
import { Lock, LogOut, Trash2 } from "lucide-react";
import { toast } from "sonner";

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

const AdminPage = () => {
  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const queryClient = useQueryClient();

  const { data: bookings = [], isLoading: bookingsLoading } = useQuery({
    queryKey: ["admin-bookings"],
    queryFn: getAllBookings,
    enabled: authenticated,
  });

  const deleteMutation = useMutation({
    mutationFn: deleteBooking,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["admin-bookings"] });
      await queryClient.invalidateQueries({ queryKey: ["bookings"] });
      toast.success("Bokningen är borttagen");
    },
    onError: (err: unknown) => {
      const message =
        err && typeof err === "object" && "message" in err && typeof (err as Error).message === "string"
          ? (err as Error).message
          : "Kunde inte ta bort bokningen";
      toast.error(message);
    },
  });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const response = await fetch(`${API_URL}/admin/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password }),
      });

      if (!response.ok) {
        let message = 'Invalid password';
        try {
          const payload = await response.json();
          if (payload?.error) {
            message = payload.error;
          }
        } catch {
          // Use default message when payload parsing fails.
        }
        throw new Error(message);
      }

      const data = await response.json();
      localStorage.setItem('admin-token', data.token);
      setAuthenticated(true);
      setPassword("");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Fel lösenord";
      setError(message);
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('admin-token');
    setAuthenticated(false);
    setPassword("");
  };

  if (!authenticated) {
    return (
      <div className="min-h-screen pt-24 pb-16 px-4 flex items-center justify-center">
        <div className="w-full max-w-sm animate-fade-up">
          <div className="text-center mb-8">
            <div className="w-14 h-14 rounded-full bg-secondary flex items-center justify-center mx-auto mb-4">
              <Lock className="w-6 h-6 text-muted-foreground" />
            </div>
            <h1 className="text-2xl font-display font-semibold">Admin</h1>
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Lösenord"
              required
              disabled={isLoading}
            />
            {error && <p className="text-sm text-destructive">{error}</p>}
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Loggar in..." : "Logga in"}
            </Button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-16 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-display font-semibold">Bokningar</h1>
          <Button variant="ghost" size="sm" onClick={handleLogout}>
            <LogOut className="w-4 h-4 mr-1" /> Logga ut
          </Button>
        </div>

        {bookingsLoading ? (
          <p className="text-muted-foreground">Laddar...</p>
        ) : bookings.length === 0 ? (
          <p className="text-muted-foreground">Inga bokningar ännu.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Ibbe Column */}
            <div>
              <h2 className="text-xl font-semibold mb-4">Ibbe</h2>
              <div className="space-y-3">
                {bookings
                  .filter((b: Booking) => b.stylist === "Ibbe")
                  .sort((a: Booking, b: Booking) => {
                    const dateCompare = new Date(a.date).getTime() - new Date(b.date).getTime();
                    if (dateCompare !== 0) return dateCompare;
                    return a.time.localeCompare(b.time);
                  })
                  .map((b: Booking) => (
                    <div
                      key={b.id}
                      className="bg-card border rounded-lg p-4 flex flex-col gap-3"
                    >
                      <div className="flex-1">
                        <p className="font-medium text-foreground">{b.customer_name}</p>
                        <p className="text-sm text-muted-foreground">{b.customer_phone}</p>
                      </div>
                      <div className="flex items-center justify-between gap-3">
                        <div className="text-sm text-muted-foreground">
                          <p>{b.service}</p>
                          {format(new Date(b.date), "d MMM", { locale: sv })}
                          {" · kl "}
                          {b.time}
                        </div>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          className="text-destructive hover:text-destructive shrink-0"
                          disabled={deleteMutation.isPending && deleteMutation.variables === b.id}
                          onClick={() => deleteMutation.mutate(b.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                {bookings.filter((b: Booking) => b.stylist === "Ibbe").length === 0 && (
                  <p className="text-sm text-muted-foreground">Inga bokningar</p>
                )}
              </div>
            </div>

            {/* Wiliam Column */}
            <div>
              <h2 className="text-xl font-semibold mb-4">Wiliam</h2>
              <div className="space-y-3">
                {bookings
                  .filter((b: Booking) => b.stylist === "Wiliam")
                  .sort((a: Booking, b: Booking) => {
                    const dateCompare = new Date(a.date).getTime() - new Date(b.date).getTime();
                    if (dateCompare !== 0) return dateCompare;
                    return a.time.localeCompare(b.time);
                  })
                  .map((b: Booking) => (
                    <div
                      key={b.id}
                      className="bg-card border rounded-lg p-4 flex flex-col gap-3"
                    >
                      <div className="flex-1">
                        <p className="font-medium text-foreground">{b.customer_name}</p>
                        <p className="text-sm text-muted-foreground">{b.customer_phone}</p>
                      </div>
                      <div className="flex items-center justify-between gap-3">
                        <div className="text-sm text-muted-foreground">
                          <p>{b.service}</p>
                          {format(new Date(b.date), "d MMM", { locale: sv })}
                          {" · kl "}
                          {b.time}
                        </div>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          className="text-destructive hover:text-destructive shrink-0"
                          disabled={deleteMutation.isPending && deleteMutation.variables === b.id}
                          onClick={() => deleteMutation.mutate(b.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                {bookings.filter((b: Booking) => b.stylist === "Wiliam").length === 0 && (
                  <p className="text-sm text-muted-foreground">Inga bokningar</p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPage;
