"use client";

import * as React from "react";
import { Button, Field, FieldLabel, Input } from "@kivora/nextjs";
import type { Title, TitleGenre, TitleType } from "@/lib/demo/types";

export interface TitleFormProps {
  onSubmit: (title: Title) => void;
}

function readAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

export function TitleForm({ onSubmit }: TitleFormProps) {
  const [name, setName] = React.useState("");
  const [genre, setGenre] = React.useState<TitleGenre>("Drama");
  const [type, setType] = React.useState<TitleType>("Película");
  const [posterUrl, setPosterUrl] = React.useState<string | undefined>(undefined);

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit({
          id: `title-${Date.now()}`,
          name,
          genre,
          type,
          releaseYear: new Date().getFullYear(),
          durationMinutes: 0,
          viewsLast30Days: 0,
          posterUrl,
        });
        setName("");
        setPosterUrl(undefined);
      }}
      className="flex flex-col gap-4"
    >
      <Field>
        <FieldLabel htmlFor="title-name">Título</FieldLabel>
        <Input
          id="title-name"
          value={name}
          onChange={(event) => setName(event.target.value)}
          required
        />
      </Field>
      <Field>
        <FieldLabel htmlFor="title-genre">Género</FieldLabel>
        <select
          id="title-genre"
          value={genre}
          onChange={(event) => setGenre(event.target.value as TitleGenre)}
          className="h-10 rounded-md border border-input bg-background px-3 text-sm"
        >
          <option value="Acción">Acción</option>
          <option value="Drama">Drama</option>
          <option value="Documental">Documental</option>
          <option value="Ciencia ficción">Ciencia ficción</option>
          <option value="Animación">Animación</option>
        </select>
      </Field>
      <Field>
        <FieldLabel htmlFor="title-type">Tipo</FieldLabel>
        <select
          id="title-type"
          value={type}
          onChange={(event) => setType(event.target.value as TitleType)}
          className="h-10 rounded-md border border-input bg-background px-3 text-sm"
        >
          <option value="Película">Película</option>
          <option value="Serie">Serie</option>
        </select>
      </Field>
      <Field>
        <FieldLabel htmlFor="title-poster">Póster (opcional)</FieldLabel>
        <input
          id="title-poster"
          type="file"
          accept="image/*"
          onChange={async (event) => {
            const file = event.target.files?.[0];
            if (file) setPosterUrl(await readAsDataUrl(file));
          }}
          className="text-sm"
        />
      </Field>
      <Button type="submit">Guardar</Button>
    </form>
  );
}
