# Component composition

Import public web components from `@kivora/nextjs`. Import React hooks and external icons explicitly. Check the installed declarations for anything beyond these examples.

## Form example

This component reports its value to its parent; the parent supplies persistence and pending/error behavior.

```tsx
"use client";

import type { FormEvent } from "react";
import { Button, Input, Label } from "@kivora/nextjs";

export function ProjectForm({ onSave }: { onSave: (name: string) => void }) {
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    onSave(String(data.get("name") ?? "").trim());
  }

  return (
    <form onSubmit={submit}>
      <Label htmlFor="project-name">Project name</Label>
      <Input id="project-name" name="name" required />
      <Button type="submit">Save project</Button>
    </form>
  );
}
```

Use `type="button"` for actions that should not submit. For navigation, use `Button asChild` around an actual link; the child must accept props and ref. Do not nest interactive elements.

## Kivora-specific APIs

- `Select` uses `options` with `{ label, value }` objects. `onChange` receives the selected option object, not a DOM event or bare string. `isMulti` changes the value shape. `loadOptions` supports async loading and `isCreatable` allows new options. Do not build it as a Radix Select with `SelectItem`; the compatibility exports are HTML elements.
- `Checkbox` and `Switch` use `checked` / `onCheckedChange`; Checkbox can also be indeterminate.
- `Slider` uses arrays for `value` and `defaultValue`, even for one thumb.
- `DatePicker` uses `value` / `onValueChange`. `Calendar` uses DayPicker's `selected` / `onSelect`; do not interchange them.
- `Card` composes with `CardHeader`, `CardTitle`, `CardDescription`, `CardContent`, and `CardFooter`.
- Dialogs need accessible titles/descriptions and a working trigger/focus flow. Verify portal styling when using scoped themes.
- `Icon` takes an icon component, e.g. `icon={Check}` from `lucide-react`. Use `label` when the icon conveys information alone; label icon-only buttons on the button.

```tsx
import { Select } from "@kivora/nextjs";

export function FrameworkSelect() {
  return (
    <Select
      aria-label="Framework"
      options={[
        { value: "next", label: "Next.js" },
        { value: "react", label: "React" },
      ]}
    />
  );
}
```

## Specialized workflows

For table filters, server-data boundaries, and date confirmation behavior, read [tables and dates](data-and-dates.md). For controller lifetimes, advanced upload state, or persistent playback, read [uploads and media](uploads-and-media.md).

QR/barcode generation is local, not scanning. Pass strings to preserve leading zeroes, valid check digits for EAN/UPC, and opaque `#RRGGBB` colors. Preserve the quiet zone. SVG data URLs require `data:` in `img-src` when the application uses CSP. Consult the installed `@kivora/codes` documentation for format limits.
