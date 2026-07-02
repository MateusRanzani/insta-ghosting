"use client";

import { useCallback, useState } from "react";
import { AlertTriangle, Loader2 } from "lucide-react";
import { UploadZone } from "@/components/UploadZone";
import { ResultsView } from "@/components/ResultsView";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { parseInstagramExportZip } from "@/lib/parse-instagram-export";
import { compareFollowLists } from "@/lib/compare-follow-lists";
import { InstagramExportParseError, type ComparisonResult } from "@/lib/types";

type Status =
  | { state: "idle" }
  | { state: "loading" }
  | { state: "error"; message: string }
  | { state: "success"; result: ComparisonResult };

export function ComparatorApp() {
  const [status, setStatus] = useState<Status>({ state: "idle" });

  const handleFileAccepted = useCallback(async (file: File) => {
    setStatus({ state: "loading" });
    try {
      const { following, followers } = await parseInstagramExportZip(file);
      const result = compareFollowLists(following, followers);
      setStatus({ state: "success", result });
    } catch (error) {
      const message =
        error instanceof InstagramExportParseError
          ? error.message
          : "Não conseguimos processar esse arquivo. Tente exportar os dados novamente pelo Instagram.";
      setStatus({ state: "error", message });
    }
  }, []);

  const handleReset = useCallback(() => setStatus({ state: "idle" }), []);

  if (status.state === "success") {
    return <ResultsView result={status.result} onReset={handleReset} />;
  }

  return (
    <div className="flex flex-col gap-4">
      <UploadZone onFileAccepted={handleFileAccepted} disabled={status.state === "loading"} />

      {status.state === "loading" && (
        <div className="text-muted-foreground flex items-center justify-center gap-2 text-sm">
          <Loader2 className="size-4 animate-spin" />
          Processando seu arquivo no navegador...
        </div>
      )}

      {status.state === "error" && (
        <Alert variant="destructive">
          <AlertTriangle />
          <AlertTitle>Não deu certo</AlertTitle>
          <AlertDescription>{status.message}</AlertDescription>
        </Alert>
      )}
    </div>
  );
}
