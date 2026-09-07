"use client";

import * as React from "react";
import { PlaySquare } from "lucide-react";
import Link from "next/link";
import {
  AspectRatio,
  Button,
  DataTable,
  Dialog,
  DialogContent,
  DialogTitle,
  type DataTableColumnDef,
} from "@kivora/nextjs";
import { useDemoData } from "@/components/demo/data-provider";
import { TitleForm } from "@/components/demo/title-form";
import { GENRES, TYPES } from "@/lib/demo/constants";
import type { Title } from "@/lib/demo/types";

function PosterThumbnail({ title }: { title: Title }) {
  return (
    <AspectRatio ratio={2 / 3} className="w-11 overflow-hidden rounded-sm bg-muted">
      {title.posterUrl ? (
        // Póster de la semilla (URL remota) o data URL subida por el usuario:
        // <img> plano a propósito, next/image no puede optimizar ninguna de
        // las dos.
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={title.posterUrl}
          alt=""
          aria-hidden="true"
          className="h-full w-full object-cover"
        />
      ) : (
        <div
          aria-hidden="true"
          className="flex h-full w-full items-center justify-center text-sm font-semibold text-muted-foreground"
        >
          {title.name.charAt(0)}
        </div>
      )}
    </AspectRatio>
  );
}

export default function CatalogoPage() {
  const { titles, addTitle } = useDemoData();
  const [open, setOpen] = React.useState(false);

  // Estable entre renders: ninguna definición depende de un valor cambiante,
  // así TanStack Table no rehace sus estructuras internas en cada render.
  const columns = React.useMemo<DataTableColumnDef<Title>[]>(
    () => [
      {
        id: "poster",
        header: "Póster",
        enableSorting: false,
        enableGlobalFilter: false,
        cell: ({ row }) => <PosterThumbnail title={row.original} />,
      },
      { accessorKey: "name", header: "Título" },
      { accessorKey: "type", header: "Tipo" },
      { accessorKey: "genre", header: "Género" },
      { accessorKey: "releaseYear", header: "Año" },
      {
        accessorKey: "viewsLast30Days",
        header: "Vistas (30d)",
        cell: ({ row }) => row.original.viewsLast30Days.toLocaleString("es-ES"),
      },
    ],
    []
  );

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-foreground">Catálogo</h1>
        <Button onClick={() => setOpen(true)}>Añadir título</Button>
      </div>
      {/* Contenedor de scroll: la tabla no cabe en un viewport estrecho. */}
      <div className="overflow-x-auto">
        <DataTable
          data={titles}
          columns={columns}
          searchable
          paginated
          pageSize={8}
          renderRowActions={(title) =>
            title.playerSource ? (
              <Link
                href={`/demo/reproductor?title=${title.id}`}
                aria-label={`Reproducir ${title.name}`}
                title={`Reproducir ${title.name}`}
                className="inline-flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
              >
                <PlaySquare aria-hidden className="h-4 w-4" />
              </Link>
            ) : null
          }
          filters={[
            {
              columnId: "type",
              label: "Tipo",
              type: "select",
              options: TYPES.map((value) => ({ label: value, value })),
            },
            {
              columnId: "genre",
              label: "Género",
              type: "select",
              options: GENRES.map((value) => ({ label: value, value })),
            },
          ]}
        />
      </div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogTitle>Añadir título</DialogTitle>
          <TitleForm
            onSubmit={(title) => {
              addTitle(title);
              setOpen(false);
            }}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
