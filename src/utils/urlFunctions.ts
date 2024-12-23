import { EmptyFilter } from "../constants/filterOptions";
import { FilterField } from "../types";

export const encodeFilters = (filters: FilterField[]): string => {
  const validFilters = filters.filter((f) => f.key && f.values.length > 0);
  if (validFilters.length === 0) return "";
  return encodeURIComponent(JSON.stringify(validFilters));
};

export const decodeFilters = (paramValue: string): FilterField[] => {
  try {
    const decoded = JSON.parse(decodeURIComponent(paramValue));
    return Array.isArray(decoded) ? decoded : [EmptyFilter];
  } catch {
    return [EmptyFilter];
  }
};
