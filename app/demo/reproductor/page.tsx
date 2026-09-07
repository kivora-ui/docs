"use client";

import * as React from "react";
import { useSearchParams } from "next/navigation";
import { Player } from "@kivora/nextjs";
import { useDemoData } from "@/components/demo/data-provider";

function ReproductorView() {
  const { titles } = useDemoData();
  const searchParams = useSearchParams();
  const playableTitles = React.useMemo(() => titles.filter((t) => t.playerSource), [titles]);

  const requestedId = searchParams.get("title");
  const initialId = playableTitles.find((t) => t.id === requestedId)?.id ?? playableTitles[0]?.id;
  const [selectedId, setSelectedId] = React.useState(initialId);

  const selected = playableTitles.find((t) => t.id === selectedId);

  if (!selected?.playerSource) {
    return <p className="text-muted-foreground">No hay contenido reproducible en el catálogo.</p>;
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-3">
        <label htmlFor="reproductor-select" className="text-sm font-medium text-foreground">
          Título
        </label>
        <select
          id="reproductor-select"
          value={selected.id}
          onChange={(event) => setSelectedId(event.target.value)}
          className="h-10 rounded-md border border-input bg-background px-3 text-sm"
        >
          {playableTitles.map((title) => (
            <option key={title.id} value={title.id}>
              {title.name}
            </option>
          ))}
        </select>
      </div>
      <Player source={selected.playerSource} locale="es" />
    </div>
  );
}

export default function ReproductorPage() {
  return (
    <React.Suspense>
      <ReproductorView />
    </React.Suspense>
  );
}
