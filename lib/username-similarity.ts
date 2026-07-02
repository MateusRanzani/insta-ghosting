import type { InstagramProfile } from "@/lib/types";

// Acima desse número estimado de comparações (órfãos × candidatos), pulamos o fallback
// fuzzy pra não travar a UI em contas muito grandes — o match exato (barato) ainda roda.
const FUZZY_COMPARISON_LIMIT = 3_000_000;
const MIN_OVERLAP_FOR_CONTAINMENT = 5;
const SIMILARITY_THRESHOLD = 0.8;

function normalizeUsername(username: string): string {
  return username.toLowerCase().replace(/[._]/g, "");
}

function levenshteinDistance(a: string, b: string): number {
  if (a === b) return 0;
  if (a.length === 0) return b.length;
  if (b.length === 0) return a.length;

  let previousRow = Array.from({ length: b.length + 1 }, (_, i) => i);

  for (let i = 0; i < a.length; i++) {
    const currentRow = [i + 1];
    for (let j = 0; j < b.length; j++) {
      currentRow.push(
        Math.min(
          currentRow[j] + 1, // inserção
          previousRow[j + 1] + 1, // remoção
          previousRow[j] + (a[i] === b[j] ? 0 : 1), // substituição
        ),
      );
    }
    previousRow = currentRow;
  }

  return previousRow[b.length];
}

function similarityScore(normalizedA: string, normalizedB: string): number {
  if (normalizedA === normalizedB) return 1;

  const shorter = normalizedA.length <= normalizedB.length ? normalizedA : normalizedB;
  const longer = normalizedA.length <= normalizedB.length ? normalizedB : normalizedA;
  if (shorter.length >= MIN_OVERLAP_FOR_CONTAINMENT && longer.includes(shorter)) return 0.9;

  const distance = levenshteinDistance(normalizedA, normalizedB);
  return 1 - distance / Math.max(normalizedA.length, normalizedB.length);
}

function findFuzzyMatch(username: string, candidates: InstagramProfile[]): InstagramProfile | null {
  const normalized = normalizeUsername(username);
  if (!normalized) return null;

  let best: { profile: InstagramProfile; score: number } | null = null;
  for (const candidate of candidates) {
    const score = similarityScore(normalized, normalizeUsername(candidate.username));
    if (score >= SIMILARITY_THRESHOLD && (!best || score > best.score)) {
      best = { profile: candidate, score };
    }
  }
  return best?.profile ?? null;
}

/**
 * Para cada perfil "órfão" (sem par exato na outra lista), tenta achar um candidato com
 * username muito parecido — provável indício de troca de @, já que o export da Meta não
 * traz um ID estável de conta. Retorna um Map de username (lowercase) do órfão -> perfil
 * candidato encontrado. Nunca é 100% garantido: é um palpite, não uma prova.
 */
export function findPossibleRenameMatches(
  orphans: InstagramProfile[],
  candidates: InstagramProfile[],
): Map<string, InstagramProfile> {
  const matches = new Map<string, InstagramProfile>();
  if (orphans.length === 0 || candidates.length === 0) return matches;

  const candidateByNormalized = new Map<string, InstagramProfile>();
  for (const candidate of candidates) {
    const normalized = normalizeUsername(candidate.username);
    if (normalized && !candidateByNormalized.has(normalized)) {
      candidateByNormalized.set(normalized, candidate);
    }
  }

  const remainingOrphans: InstagramProfile[] = [];
  for (const orphan of orphans) {
    const exact = candidateByNormalized.get(normalizeUsername(orphan.username));
    if (exact) matches.set(orphan.username.toLowerCase(), exact);
    else remainingOrphans.push(orphan);
  }

  const estimatedComparisons = remainingOrphans.length * candidates.length;
  if (estimatedComparisons > 0 && estimatedComparisons <= FUZZY_COMPARISON_LIMIT) {
    for (const orphan of remainingOrphans) {
      const match = findFuzzyMatch(orphan.username, candidates);
      if (match) matches.set(orphan.username.toLowerCase(), match);
    }
  }

  return matches;
}
