"use client";

import { useCallback, useRef, useState } from "react";
import { UploadCloud } from "lucide-react";
import { cn } from "@/lib/utils";

interface UploadZoneProps {
  onFileAccepted: (file: File) => void;
  disabled?: boolean;
}

export function UploadZone({ onFileAccepted, disabled }: UploadZoneProps) {
  const [isDraggingOver, setIsDraggingOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFiles = useCallback(
    (fileList: FileList | null) => {
      const file = fileList?.[0];
      if (file) onFileAccepted(file);
    },
    [onFileAccepted],
  );

  return (
    <div
      role="button"
      tabIndex={0}
      aria-disabled={disabled}
      onClick={() => !disabled && inputRef.current?.click()}
      onKeyDown={(e) => {
        if (!disabled && (e.key === "Enter" || e.key === " ")) inputRef.current?.click();
      }}
      onDragOver={(e) => {
        e.preventDefault();
        if (!disabled) setIsDraggingOver(true);
      }}
      onDragLeave={() => setIsDraggingOver(false)}
      onDrop={(e) => {
        e.preventDefault();
        setIsDraggingOver(false);
        if (!disabled) handleFiles(e.dataTransfer.files);
      }}
      className={cn(
        "flex flex-col items-center justify-center gap-3 rounded-3xl border-2 border-dashed px-6 py-12 text-center transition-colors",
        disabled ? "cursor-not-allowed opacity-60" : "cursor-pointer",
        isDraggingOver
          ? "border-fuchsia-400 bg-fuchsia-50/60"
          : "border-border bg-muted/30 hover:border-fuchsia-300 hover:bg-fuchsia-50/30",
      )}
    >
      <input
        ref={inputRef}
        type="file"
        accept=".zip,application/zip,application/x-zip-compressed"
        className="hidden"
        disabled={disabled}
        onChange={(e) => handleFiles(e.target.files)}
      />
      <div className="bg-gradient-instagram flex size-14 items-center justify-center rounded-full text-white">
        <UploadCloud className="size-7" />
      </div>
      <div>
        <p className="font-medium">Arraste o arquivo .zip aqui ou clique para selecionar</p>
        <p className="text-muted-foreground mt-1 text-sm">
          É o arquivo que você recebeu da Meta com a exportação de &quot;Conexões&quot;
        </p>
      </div>
    </div>
  );
}
