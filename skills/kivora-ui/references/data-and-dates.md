# Tables and dates

Consult the installed version before relying on these behaviors. Sources: the module repository's `docs/data-table-filters.md` and `docs/date-picker.md`; see the source policy in SKILL.md.

## DataTable filters

Use Kivora's exported `DataTableColumnDef` and `DataTableFilter` types rather than copying a TanStack example from a different major version.

```tsx
import { DataTable, type DataTableColumnDef, type DataTableFilter } from "@kivora/nextjs";

type Product = { name: string; active: boolean };
const columns: DataTableColumnDef<Product>[] = [
  { accessorKey: "name", header: "Product" },
  { accessorKey: "active", header: "Active" },
];
const filters = [
  { columnId: "active", type: "switch", label: "Active only" },
] satisfies DataTableFilter[];

export function Products({ data }: { data: Product[] }) {
  return <DataTable columns={columns} data={data} filters={filters} searchable paginated />;
}
```

- Match `columnId` to the column's ID, usually `accessorKey`. Give `accessorFn` columns an explicit ID. Filtering uses accessor data, not the displayed cell text.
- `text` means case-insensitive containment; `select` means equality with the original option value; an enabled `switch` matches `true`. A disabled switch removes the filter, rather than matching `false`. Use a select for All / Yes / No. `false`, `0`, and `""` are valid option values.
- Filters and search combine with AND. Changing filters resets pagination. Clear removes column filters but retains general search.
- `filters` enables the panel; `filterable={false}` disables it. `filters={[]}` suppresses automatically generated controls. A column's custom `filterFn` is preserved.
- Filtering and pagination operate on loaded `data`. They do not query a server or filter unloaded rows. For server filtering/pagination, manage the query and external controls in the application; do not claim this API implements a server data source.

## DatePicker versus Calendar

`DatePicker` uses `value` / `onValueChange` and modes `single`, `range`, `month`, `year`. `withTime` adds time to `single`; `timeFormat` is `12h` (default) or `24h`. `Calendar` exposes DayPicker behavior and is the choice for independent multiple dates or `disabled` day restrictions.

With an action footer (default for range and date-with-time), changes are drafts until Apply. Cancel, Escape, and outside dismissal discard them; Clear clears the draft and still needs Apply. An incomplete range cannot be applied. With `showFooter={false}`, updates are immediate and a range may first emit `{ from, to: undefined }`; handle that shape.

Passing `value`, even `value={undefined}`, makes DatePicker controlled: update it in `onValueChange`. Without `value`, initialize using `defaultValue`. For a local calendar date use `new Date(year, monthIndex, day)` rather than parsing a UTC date-only string.

`locale` configures the calendar; `localeCode` controls the field's date formatting. Do not promise that this translates every action label: the source guide notes English action labels and default presets. Supply custom preset labels where supported.

Verify Apply/Cancel and controlled clearing in the actual installed version; a declaration alone cannot establish behavioral compatibility.
