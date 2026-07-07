"use client";

import { useState, type ReactNode } from "react";
import { ArrowLeft, ArrowRight, Laptop, Lock, PlayCircle, ShieldOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { EXPORT_TUTORIAL_STEPS } from "@/lib/tutorial-steps";

interface WizardStep {
  title: string;
  render: () => ReactNode;
}

const HOW_IT_WORKS_STEP: WizardStep = {
  title: "Como o app funciona",
  render: () => (
    <ul className="flex flex-col gap-3 text-sm">
      <li className="flex gap-2">
        <Lock className="mt-0.5 size-4 shrink-0 text-fuchsia-600" />
        Você nunca digita usuário ou senha do Instagram aqui — só faz upload de um
        arquivo seu.
      </li>
      <li className="flex gap-2">
        <Laptop className="mt-0.5 size-4 shrink-0 text-fuchsia-600" />
        Esse arquivo é lido e comparado inteiramente no seu navegador — nada é enviado
        a um servidor.
      </li>
      <li className="flex gap-2">
        <ShieldOff className="mt-0.5 size-4 shrink-0 text-fuchsia-600" />
        Não acessamos o Instagram de forma automatizada — zero risco pra sua conta.
      </li>
    </ul>
  ),
};

const WIZARD_STEPS: WizardStep[] = [
  HOW_IT_WORKS_STEP,
  ...EXPORT_TUTORIAL_STEPS.map((step) => ({
    title: step.title,
    render: () => <p className="text-muted-foreground text-sm">{step.description}</p>,
  })),
];

export function HowItWorksWizard() {
  const [open, setOpen] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);

  const isFirst = stepIndex === 0;
  const isLast = stepIndex === WIZARD_STEPS.length - 1;
  const step = WIZARD_STEPS[stepIndex];

  function handleOpenChange(nextOpen: boolean) {
    setOpen(nextOpen);
    if (!nextOpen) setStepIndex(0);
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger render={<Button variant="outline" className="rounded-full" />}>
        <PlayCircle className="size-4" />
        Como funciona / onde baixar o arquivo
      </DialogTrigger>

      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <span className="text-muted-foreground text-xs font-medium">
            Passo {stepIndex + 1} de {WIZARD_STEPS.length}
          </span>
          <DialogTitle>{step.title}</DialogTitle>
        </DialogHeader>

        <Progress value={((stepIndex + 1) / WIZARD_STEPS.length) * 100} />

        <div className="min-h-24">{step.render()}</div>

        <DialogFooter className="sm:justify-between">
          <Button
            variant="ghost"
            onClick={() => setStepIndex((i) => Math.max(0, i - 1))}
            disabled={isFirst}
          >
            <ArrowLeft className="size-4" />
            Voltar
          </Button>
          {isLast ? (
            <Button className="rounded-full" onClick={() => handleOpenChange(false)}>
              Entendi, vamos lá!
            </Button>
          ) : (
            <Button className="rounded-full" onClick={() => setStepIndex((i) => i + 1)}>
              Próximo
              <ArrowRight className="size-4" />
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
