"use client";

import * as React from "react";
import { Button, Field, FieldLabel, Input } from "@kivora/nextjs";
import type { Plan, Subscriber } from "@/lib/demo/types";

const PRICE_CENTS_BY_PLAN: Record<Plan, number> = { "Básico": 599, "Estándar": 999, "Premium": 1499 };

export interface SubscriberFormProps {
  onSubmit: (subscriber: Subscriber) => void;
}

export function SubscriberForm({ onSubmit }: SubscriberFormProps) {
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [plan, setPlan] = React.useState<Plan>("Básico");

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit({
          id: `sub-${Date.now()}`,
          name,
          email,
          plan,
          status: "active",
          joinedAt: new Date().toISOString().slice(0, 10),
          monthlyPriceCents: PRICE_CENTS_BY_PLAN[plan],
        });
        setName("");
        setEmail("");
      }}
      className="flex flex-col gap-4"
    >
      <Field>
        <FieldLabel htmlFor="subscriber-name">Nombre</FieldLabel>
        <Input id="subscriber-name" value={name} onChange={(e) => setName(e.target.value)} required />
      </Field>
      <Field>
        <FieldLabel htmlFor="subscriber-email">Email</FieldLabel>
        <Input
          id="subscriber-email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </Field>
      <Field>
        <FieldLabel htmlFor="subscriber-plan">Plan</FieldLabel>
        <select
          id="subscriber-plan"
          value={plan}
          onChange={(event) => setPlan(event.target.value as Plan)}
          className="h-10 rounded-md border border-input bg-background px-3 text-sm"
        >
          <option value="Básico">Básico</option>
          <option value="Estándar">Estándar</option>
          <option value="Premium">Premium</option>
        </select>
      </Field>
      <Button type="submit">Guardar</Button>
    </form>
  );
}
