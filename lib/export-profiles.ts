import type { InstagramProfile } from "@/lib/types";

function toCsv(profiles: InstagramProfile[]): string {
  const header = "username,perfil";
  const rows = profiles.map((p) => `${p.username},${p.href ?? ""}`);
  return [header, ...rows].join("\n");
}

/** Gera um .csv com os perfis (username + link) e dispara o download no navegador.
 * Não faz nenhuma requisição de rede — só monta o arquivo localmente. */
export function downloadProfilesAsCsv(profiles: InstagramProfile[], fileName: string): void {
  const csv = toCsv(profiles);
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  link.click();

  URL.revokeObjectURL(url);
}
