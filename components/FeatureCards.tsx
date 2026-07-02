import { Laptop, Lock, ShieldOff } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const FEATURES = [
  {
    icon: Lock,
    title: "Sem login no Instagram",
    description: "Nunca pedimos seu usuário ou senha. Você só faz upload de um arquivo seu.",
  },
  {
    icon: ShieldOff,
    title: "Sem scraping",
    description: "Zero requisições automatizadas ao Instagram — sua conta nunca corre risco de ban.",
  },
  {
    icon: Laptop,
    title: "100% no seu navegador",
    description: "O processamento acontece no seu computador. Nenhum dado seu é enviado a um servidor.",
  },
];

export function FeatureCards() {
  return (
    <div className="grid gap-4 sm:grid-cols-3">
      {FEATURES.map(({ icon: Icon, title, description }) => (
        <Card key={title} className="border-border/60 gap-2 rounded-2xl">
          <CardContent className="flex flex-col gap-3 px-5">
            <div className="bg-gradient-instagram flex size-10 items-center justify-center rounded-full text-white">
              <Icon className="size-5" />
            </div>
            <h3 className="font-medium">{title}</h3>
            <p className="text-muted-foreground text-sm">{description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
