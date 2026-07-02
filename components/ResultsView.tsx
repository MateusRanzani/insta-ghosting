"use client";

import { Info, RotateCcw, UserMinus, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProfileList } from "@/components/ProfileList";
import type { ComparisonResult } from "@/lib/types";

interface ResultsViewProps {
  result: ComparisonResult;
  onReset: () => void;
}

export function ResultsView({ result, onReset }: ResultsViewProps) {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-muted-foreground text-sm">
          Você segue <span className="text-foreground font-medium">{result.totalFollowing}</span>{" "}
          perfis e é seguido por{" "}
          <span className="text-foreground font-medium">{result.totalFollowers}</span>.
        </p>
        <Button variant="outline" className="rounded-full" onClick={onReset}>
          <RotateCcw className="size-4" />
          Analisar outro arquivo
        </Button>
      </div>

      <Tabs defaultValue="not-following-back">
        <TabsList className="h-auto w-full gap-1 bg-transparent p-0">
          <TabsTrigger
            value="not-following-back"
            className="h-auto flex-1 gap-2 rounded-full border py-2 data-active:bg-foreground data-active:text-background"
          >
            <UserMinus className="size-4" />
            Não te seguem de volta
            <span className="ml-1 rounded-full bg-black/10 px-1.5 py-0.5 text-xs group-data-active/tabs-list:bg-white/20">
              {result.notFollowingBack.length}
            </span>
          </TabsTrigger>
          <TabsTrigger
            value="you-dont-follow-back"
            className="h-auto flex-1 gap-2 rounded-full border py-2 data-active:bg-foreground data-active:text-background"
          >
            <UserPlus className="size-4" />
            Você não segue de volta
            <span className="ml-1 rounded-full bg-black/10 px-1.5 py-0.5 text-xs group-data-active/tabs-list:bg-white/20">
              {result.youDontFollowBack.length}
            </span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="not-following-back" className="mt-4">
          <ProfileList
            profiles={result.notFollowingBack}
            emptyMessage="Ninguém por aqui — todo mundo que você segue, te segue de volta."
          />
        </TabsContent>
        <TabsContent value="you-dont-follow-back" className="mt-4">
          <ProfileList
            profiles={result.youDontFollowBack}
            emptyMessage="Ninguém por aqui — você já segue de volta todo mundo que te segue."
          />
        </TabsContent>
      </Tabs>

      <p className="text-muted-foreground flex items-start gap-1.5 text-xs">
        <Info className="mt-0.5 size-3.5 shrink-0" />
        Quando o username é bem parecido com o de alguém na outra lista, marcamos com um
        aviso de &quot;pode ser @X&quot; — mas é só um palpite, sem garantia. Se um link não abrir e
        não houver esse aviso, a pessoa provavelmente trocou de @ ou desativou a conta;
        essa inconsistência vem do próprio arquivo do Instagram, não é um erro do
        comparador.
      </p>
    </div>
  );
}
