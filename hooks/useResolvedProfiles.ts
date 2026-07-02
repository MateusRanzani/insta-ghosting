"use client";

import { useCallback, useState } from "react";

const STORAGE_KEY = "insta-ghosting:resolved-profiles";

function readFromStorage(): Set<string> {
  if (typeof window === "undefined") return new Set();
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? new Set(JSON.parse(raw) as string[]) : new Set();
  } catch {
    return new Set();
  }
}

function writeToStorage(usernames: Set<string>) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify([...usernames]));
}

/**
 * Guarda, no navegador do usuário, quais perfis ele já marcou como "resolvido"
 * (ex: já deixou de seguir). Decisão explícita do usuário em 2026-07-02: persistir
 * em localStorage (não em servidor) para sobreviver a fechar/abrir a aba enquanto
 * ele revisa uma lista grande aos poucos.
 */
export function useResolvedProfiles() {
  const [resolved, setResolved] = useState<Set<string>>(() => readFromStorage());

  const toggle = useCallback((username: string) => {
    const key = username.toLowerCase();
    setResolved((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      writeToStorage(next);
      return next;
    });
  }, []);

  const isResolved = useCallback((username: string) => resolved.has(username.toLowerCase()), [resolved]);

  return { isResolved, toggle, resolvedCount: resolved.size };
}
