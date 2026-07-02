const STEPS = [
  {
    title: "Vá em Configurações → Central de Contas",
    description: 'No app do Instagram, acesse "Suas informações e permissões" → "Exportar informações".',
  },
  {
    title: 'Selecione apenas "Conexões"',
    description:
      'Escolha só a categoria "Conexões" (não "Todas as informações") — assim o arquivo fica bem menor e mais rápido de gerar.',
  },
  {
    title: 'Formato "JSON" e mídia baixa',
    description:
      'Escolha o formato "JSON" (não HTML) e qualidade de mídia baixa ou nenhuma — isso acelera bastante a geração.',
  },
  {
    title: 'Não inclua "registros de dados"',
    description:
      "Deixe essa opção desmarcada: ela não é necessária aqui e pode levar até 15 dias para ficar pronta.",
  },
  {
    title: "Aguarde o aviso da Meta",
    description:
      "Você recebe um e-mail ou notificação quando o arquivo está pronto — geralmente em algumas horas.",
  },
  {
    title: "Volte aqui e envie o .zip",
    description: "Faça upload do arquivo recebido. Tudo é processado no seu navegador, nada sai do seu computador.",
  },
];

export function TutorialSteps() {
  return (
    <ol className="grid gap-4 sm:grid-cols-2">
      {STEPS.map((step, index) => (
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
