export interface TutorialStep {
  title: string;
  description: string;
}

/** Passo a passo pra conseguir o arquivo de exportação de dados do Instagram.
 * Compartilhado entre a grade estática da landing page e o wizard interativo. */
export const EXPORT_TUTORIAL_STEPS: TutorialStep[] = [
  {
    title: "Vá em Configurações → Central de Contas",
    description:
      'No app do Instagram, acesse "Suas informações e permissões" → "Exportar informações".',
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
    description:
      "Faça upload do arquivo recebido. Tudo é processado no seu navegador, nada sai do seu computador.",
  },
];
