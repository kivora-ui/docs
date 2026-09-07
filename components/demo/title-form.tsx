"use client";

import * as React from "react";
import { Button, Field, FieldLabel, Input } from "@kivora/nextjs";
import { GENRES, MAX_POSTER_BYTES, TYPES } from "@/lib/demo/constants";
import type { Title, TitleGenre, TitleType } from "@/lib/demo/types";

export interface TitleFormProps {
  onSubmit: (title: Title) => void;
}

function formatKilobytes(bytes: number): string {
  return `${Math.round(bytes / 1024)} KB`;
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
  const [posterError, setPosterError] = React.useState<string | null>(null);

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
        setPosterError(null);
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
          {GENRES.map((value) => (
            <option key={value} value={value}>
              {value}
            </option>
          ))}
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
          {TYPES.map((value) => (
            <option key={value} value={value}>
              {value}
            </option>
          ))}
        </select>
      </Field>
      <Field>
        <FieldLabel htmlFor="title-poster">Póster (opcional)</FieldLabel>
        <input
          id="title-poster"
          type="file"
          accept="image/*"
          aria-describedby={posterError ? "title-poster-error" : undefined}
          aria-invalid={posterError ? true : undefined}
          onChange={async (event) => {
            const file = event.target.files?.[0];
            if (!file) return;
            // El póster acaba como data URL dentro del store de localStorage:
            // una imagen de varios MB reventaría la cuota y el setItem del
            // provider fallaría en silencio, perdiendo los datos al recargar.
            if (file.size > MAX_POSTER_BYTES) {
              setPosterUrl(undefined);
              setPosterError(
                `El póster no puede superar ${formatKilobytes(MAX_POSTER_BYTES)}. Elige una imagen más pequeña.`
              );
              return;
            }
            setPosterError(null);
            setPosterUrl(await readAsDataUrl(file));
          }}
          className="text-sm"
        />
        {posterError ? (
          <p id="title-poster-error" role="alert" className="text-sm text-destructive">
            {posterError}
          </p>
        ) : null}
      </Field>
      <Button type="submit">Guardar</Button>
    </form>
  );
}
