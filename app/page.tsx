import { ComparatorApp } from "@/components/ComparatorApp";
import { FeatureCards } from "@/components/FeatureCards";
import { HowItWorksWizard } from "@/components/HowItWorksWizard";
import { TutorialSteps } from "@/components/TutorialSteps";

export default function Home() {
  return (
    <div className="flex flex-1 flex-col">
      <section className="bg-hero-soft flex flex-col items-center gap-6 px-6 pt-16 pb-10 text-center sm:pt-24">
        <span className="bg-gradient-instagram rounded-full px-3 py-1 text-xs font-medium text-white">
          Sem login · Sem scraping · 100% seguro
        </span>
        <h1 className="max-w-2xl text-4xl leading-tight font-semibold tracking-tight sm:text-5xl">
          Descubra quem{" "}
          <span className="text-gradient-instagram">não te segue de volta</span>{" "}
          no Instagram
        </h1>
        <p className="text-muted-foreground max-w-xl text-lg text-balance">
          Envie o arquivo de exportação de dados que a própria Meta te dá —
          descobrimos tudo no seu navegador, sem salvar dados, sem pedir sua
          senha e sem qualquer risco pra sua conta.
        </p>
        <HowItWorksWizard />
      </section>

      <section className="mx-auto -mt-2 w-full max-w-2xl px-6 pb-4">
        <ComparatorApp />
      </section>

      <section className="mx-auto w-full max-w-4xl px-6 py-16">
        <FeatureCards />
      </section>

      <section className="mx-auto w-full max-w-4xl px-6 pb-16">
        <div className="mb-8 flex flex-col items-center gap-4 text-center">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight">
              Como conseguir o arquivo de exportação
            </h2>
            <p className="text-muted-foreground mt-2">
              Leva algumas horas pela Meta te avisar, mas o processo é simples.
            </p>
          </div>
          <HowItWorksWizard />
        </div>
        <TutorialSteps />
      </section>

      <footer className="text-muted-foreground border-t px-6 py-8 text-center text-sm">
        Este app não é afiliado ao Instagram ou à Meta. Nenhum dado que você
        envia sai do seu navegador.
      </footer>
    </div>
  );
}
