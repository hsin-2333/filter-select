import { FilterField } from "../types";

export const UnitMultipliers: Record<string, number> = {
  MiB: 1024 * 1024,
  GiB: 1024 * 1024 * 1024,
  TiB: 1024 * 1024 * 1024 * 1024,
  PiB: 1024 * 1024 * 1024 * 1024 * 1024,
};

export const KeyMap: Record<string, string> = {
  Status: "status",
  "Parent ID": "parent_id",
  Size: "size",
  Activated: "activated",
};

export const EmptyFilter: FilterField = {
  key: "",
  operator: "in",
  values: [],
  unit: "GiB",
};

export const FilterOptions = ["Status", "Parent ID", "Size", "Activated"];
export const SizeOptions = ["MiB", "GiB", "TiB", "PiB"];
export const StatusOptions = ["Online", "Offline", "Rebuild", "Failed", "Missing"];
export const ParentOptions = ["P-0", "P-1", "P-2"];
export const ActivatedOptions = [
  { value: true, label: "On" },
  { value: false, label: "Off" },
];
export const OperatorOptions = [
  { value: "in", label: "=" },
  { value: "ge", label: "≥" },
  { value: "le", label: "≤" },
];
