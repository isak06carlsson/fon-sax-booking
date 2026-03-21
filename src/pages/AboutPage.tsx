import { User } from "lucide-react";

const stylists = [
  {
    name: "Ibbe",
    description:
      "Med flera års erfarenhet inom herrklippning och styling är Ibbe expert på att skapa den perfekta looken. Han är känd för sin precision och sitt öga för detaljer.",
  },
  {
    name: "Wiliam",
    description:
      "Wiliam har en passion för moderna frisyrer och trender. Med en avslappnad stil och stor kunskap hjälper han dig att hitta en frisyr som passar just dig.",
  },
];

const AboutPage = () => {
  return (
    <div className="min-h-screen pt-24 pb-16 px-4">
      <div className="container mx-auto max-w-3xl">
        <div className="text-center mb-16 animate-fade-up">
          <h1 className="text-3xl md:text-4xl font-display font-semibold mb-6">Om oss</h1>
          <p className="text-muted-foreground leading-relaxed max-w-xl mx-auto" style={{ textWrap: "pretty" } as React.CSSProperties}>
            Fön & Sax är mer än bara en frisörsalong – det är en plats där stil möter 
            hantverk. Vi ligger på Bruksgatan 32 i Helsingborg och har skapat en modern, 
            välkomnande salong där du kan slappna av och bli omhändertagen.
          </p>
        </div>

        <h2 className="text-2xl font-display font-semibold text-center mb-10">Våra frisörer</h2>

        <div className="grid md:grid-cols-2 gap-8">
          {stylists.map((s, i) => (
            <div
              key={s.name}
              className="bg-card border rounded-lg p-8 text-center shadow-sm animate-fade-up"
              style={{ animationDelay: `${0.15 + i * 0.1}s`, animationFillMode: "both" }}
            >
              <div className="w-20 h-20 rounded-full bg-secondary flex items-center justify-center mx-auto mb-5">
                <User className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="font-display text-xl font-semibold mb-3">{s.name}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{s.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
