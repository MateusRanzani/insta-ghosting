import type { ComparisonResult } from "@/lib/types";

interface ResultsDashboardProps {
  result: ComparisonResult;
}

export function ResultsDashboard({ result }: ResultsDashboardProps) {
  const mutualCount = result.totalFollowing - result.notFollowingBack.length;

  const stats = [
    { label: "Não te seguem de volta", value: result.notFollowingBack.length },
    { label: "Você não segue de volta", value: result.youDontFollowBack.length },
    { label: "Recíproco (seguem um ao outro)", value: mutualCount },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 rounded-2xl border p-5 sm:grid-cols-3">
      {stats.map((stat) => (
        <div key={stat.label} className="flex flex-col">
          <span className="text-2xl font-semibold">{stat.value}</span>
          <span className="text-muted-foreground text-xs">{stat.label}</span>
        </div>
      ))}
    </div>
  );
}
