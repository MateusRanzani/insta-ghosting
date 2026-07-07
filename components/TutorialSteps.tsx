import { EXPORT_TUTORIAL_STEPS } from "@/lib/tutorial-steps";

export function TutorialSteps() {
  return (
    <ol className="grid gap-4 sm:grid-cols-2">
      {EXPORT_TUTORIAL_STEPS.map((step, index) => (
        <li key={step.title} className="flex gap-3 rounded-2xl border p-4">
          <span className="bg-gradient-instagram flex size-7 shrink-0 items-center justify-center rounded-full text-sm font-medium text-white">
            {index + 1}
          </span>
          <div>
            <p className="font-medium">{step.title}</p>
            <p className="text-muted-foreground mt-0.5 text-sm">{step.description}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}
