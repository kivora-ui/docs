"use client";

import * as React from "react";
import { Button, DataTable, Dialog, DialogContent, DialogTitle, type DataTableColumnDef } from "@kivora/nextjs";
import { useDemoData } from "@/components/demo/data-provider";
import { TitleForm } from "@/components/demo/title-form";
import type { Title, TitleGenre, TitleType } from "@/lib/demo/types";

const GENRES: TitleGenre[] = ["Acción", "Drama", "Documental", "Ciencia ficción", "Animación"];
const TYPES: TitleType[] = ["Película", "Serie"];

export default function CatalogoPage() {
  const { titles, addTitle } = useDemoData();
  const [open, setOpen] = React.useState(false);

  const columns: DataTableColumnDef<Title>[] = [
    { accessorKey: "name", header: "Título" },
    { accessorKey: "type", header: "Tipo" },
    { accessorKey: "genre", header: "Género" },
    { accessorKey: "releaseYear", header: "Año" },
    {
      accessorKey: "viewsLast30Days",
      header: "Vistas (30d)",
      cell: ({ row }) => row.original.viewsLast30Days.toLocaleString("es-ES"),
    },
  ];

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-foreground">Catálogo</h1>
        <Button onClick={() => setOpen(true)}>Añadir título</Button>
      </div>
      <DataTable
        data={titles}
        columns={columns}
        searchable
        paginated
        pageSize={8}
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
