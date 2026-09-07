"use client";

import * as React from "react";
import { Button, DataTable, Dialog, DialogContent, DialogTitle, type DataTableColumnDef } from "@kivora/nextjs";
import { useDemoData } from "@/components/demo/data-provider";
import { SubscriberForm } from "@/components/demo/subscriber-form";
import type { Plan, Subscriber } from "@/lib/demo/types";

const STATUS_LABEL: Record<Subscriber["status"], string> = {
  active: "Activo",
  paused: "Pausado",
  cancelled: "Cancelado",
};
const PLANS: Plan[] = ["Básico", "Estándar", "Premium"];
const STATUSES: Subscriber["status"][] = ["active", "paused", "cancelled"];

export default function SuscriptoresPage() {
  const { subscribers, addSubscriber } = useDemoData();
  const [open, setOpen] = React.useState(false);

  const columns: DataTableColumnDef<Subscriber>[] = [
    { accessorKey: "name", header: "Nombre" },
    { accessorKey: "email", header: "Email" },
    { accessorKey: "plan", header: "Plan" },
    {
      accessorKey: "status",
      header: "Estado",
      cell: ({ row }) => STATUS_LABEL[row.original.status],
    },
    { accessorKey: "joinedAt", header: "Alta" },
  ];

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-foreground">Suscriptores</h1>
        <Button onClick={() => setOpen(true)}>Añadir suscriptor</Button>
      </div>
      <DataTable
        data={subscribers}
        columns={columns}
        searchable
        paginated
        pageSize={8}
        filters={[
          {
            columnId: "plan",
            label: "Plan",
            type: "select",
            options: PLANS.map((value) => ({ label: value, value })),
          },
          {
            columnId: "status",
            label: "Estado",
            type: "select",
            options: STATUSES.map((value) => ({ label: STATUS_LABEL[value], value })),
          },
        ]}
      />
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogTitle>Añadir suscriptor</DialogTitle>
          <SubscriberForm
            onSubmit={(subscriber) => {
              addSubscriber(subscriber);
              setOpen(false);
            }}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
