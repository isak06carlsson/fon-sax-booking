import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Scissors, MapPin, Clock } from "lucide-react";
import heroImage from "@/assets/hero-salon.jpg";

const Index = () => {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative h-[85vh] min-h-[600px] flex items-center justify-center overflow-hidden">
        <img
          src={heroImage}
          alt="Fön och Sax salongens interiör"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-foreground/40" />
        <div className="relative z-10 text-center px-4 animate-fade-up">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-display font-semibold text-primary-foreground leading-[1.1] mb-4">
            Fön & Sax
          </h1>
          <p className="font-body text-primary-foreground/90 text-lg md:text-xl max-w-md mx-auto mb-8" style={{ textWrap: "balance" } as React.CSSProperties}>
            Din frisörsalong på Bruksgatan 32, Helsingborg
          </p>
          <Link to="/boka">
            <Button variant="hero" size="lg" className="rounded-full px-10 py-6 text-base">
              Boka nu
            </Button>
          </Link>
        </div>
      </section>

      {/* About preview */}
      <section className="py-24 px-4">
        <div className="container mx-auto max-w-3xl text-center">
          <div className="animate-fade-up" style={{ animationDelay: "0.1s", animationFillMode: "both" }}>
            <Scissors className="w-8 h-8 text-primary mx-auto mb-6" />
            <h2 className="text-3xl md:text-4xl font-display font-semibold mb-6">
              Välkommen till oss
            </h2>
            <p className="text-muted-foreground leading-relaxed max-w-xl mx-auto mb-8" style={{ textWrap: "pretty" } as React.CSSProperties}>
              Fön & Sax är en modern frisörsalong i hjärtat av Helsingborg. Vi erbjuder 
              professionell hårklippning, styling och skäggtrimning i en avslappnad och 
              välkomnande miljö. Våra erfarna frisörer Ibbe och Wiliam ser till att du 
              alltid lämnar salongen nöjd.
            </p>
          </div>
        </div>
      </section>

      {/* Info cards */}
      <section className="pb-24 px-4">
        <div className="container mx-auto max-w-4xl grid md:grid-cols-2 gap-6">
          <div className="bg-card rounded-lg p-8 shadow-sm border animate-fade-up" style={{ animationDelay: "0.2s", animationFillMode: "both" }}>
            <MapPin className="w-6 h-6 text-primary mb-4" />
            <h3 className="font-display text-xl font-semibold mb-2">Hitta hit</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Bruksgatan 32, Helsingborg<br />
              Centralt beläget med goda parkeringsmöjligheter.
            </p>
          </div>
          <div className="bg-card rounded-lg p-8 shadow-sm border animate-fade-up" style={{ animationDelay: "0.3s", animationFillMode: "both" }}>
            <Clock className="w-6 h-6 text-primary mb-4" />
            <h3 className="font-display text-xl font-semibold mb-2">Öppettider</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Mån–Fre: 09:00 – 18:00<br />
              Lör: 10:00 – 15:00<br />
              Sön: Stängt
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8 px-4">
        <div className="container mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <span className="font-display text-foreground font-semibold">Fön & Sax</span>
          <span>© {new Date().getFullYear()} Fön & Sax. Alla rättigheter förbehållna.</span>
        </div>
      </footer>
    </div>
  );
};

export default Index;
