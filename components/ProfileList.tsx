"use client";

import { useMemo, useState } from "react";
import { ExternalLink, Search, Shuffle, UserX } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import { useResolvedProfiles } from "@/hooks/useResolvedProfiles";
import type { ProfileWithRenameHint } from "@/lib/types";

interface ProfileListProps {
  profiles: ProfileWithRenameHint[];
  emptyMessage: string;
}

export function ProfileList({ profiles, emptyMessage }: ProfileListProps) {
  const [search, setSearch] = useState("");
  const [hideResolved, setHideResolved] = useState(false);
  const { isResolved, toggle, resolvedCount } = useResolvedProfiles();

  const filteredProfiles = useMemo(() => {
    const query = search.trim().toLowerCase();
    return profiles
      .filter((profile) => !query || profile.username.toLowerCase().includes(query))
      .filter((profile) => !hideResolved || !isResolved(profile.username));
  }, [profiles, search, hideResolved, isResolved]);

  return (
    <div className="flex flex-col gap-3">
      <div className="relative">
        <Search className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2" />
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar por username..."
          className="pl-9"
        />
      </div>

      {profiles.length > 0 && (
        <label className="text-muted-foreground flex items-center justify-between gap-2 text-sm">
          <span className="flex items-center gap-2">
            <Switch checked={hideResolved} onCheckedChange={setHideResolved} size="sm" />
            Ocultar já resolvidos
          </span>
          {resolvedCount > 0 && <span>{resolvedCount} marcados como resolvidos</span>}
        </label>
      )}

      {filteredProfiles.length === 0 ? (
        <div className="text-muted-foreground flex flex-col items-center gap-2 rounded-xl border border-dashed py-10 text-center text-sm">
          <UserX className="size-6" />
          {profiles.length === 0
            ? emptyMessage
            : hideResolved
              ? "Você já resolveu todo mundo dessa lista."
              : "Nenhum username encontrado para essa busca."}
        </div>
      ) : (
        <ul className="max-h-[26rem] divide-y overflow-y-auto rounded-xl border">
          {filteredProfiles.map((profile) => {
            const resolved = isResolved(profile.username);
            return (
              <li key={profile.username} className="flex items-center gap-3 px-4 py-2.5">
                <Checkbox
                  checked={resolved}
                  onCheckedChange={() => toggle(profile.username)}
                  aria-label={`Marcar @${profile.username} como resolvido`}
                />
                <div className="min-w-0 flex-1">
                  <span
                    className={cn(
                      "block truncate font-medium",
                      resolved && "text-muted-foreground line-through",
                    )}
                  >
                    @{profile.username}
                  </span>
                  {profile.possibleRename && (
                    <p className="flex items-center gap-1 truncate text-xs text-amber-600 dark:text-amber-500">
                      <Shuffle className="size-3 shrink-0" />
                      Pode ser @{profile.possibleRename.username} — talvez tenha mudado de @
                    </p>
                  )}
                </div>
                {profile.href && (
                  <a
                    href={profile.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-foreground shrink-0"
                    aria-label={`Abrir perfil de ${profile.username} no Instagram`}
                  >
                    <ExternalLink className="size-4" />
                  </a>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
