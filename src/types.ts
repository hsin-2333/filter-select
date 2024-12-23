export interface FilterFormData {
  filters: FilterField[];
}
export interface FilterField {
  key: string;
  operator: string;
  values: (string | number | boolean)[];
  unit?: string;
}

export interface TransformedFilters {
  [key: string]: {
    operator: string;
    values: (string | number | boolean)[];
  };
}
