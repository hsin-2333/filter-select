import { DeleteOutlined, FilterOutlined, PlusOutlined } from "@ant-design/icons";
import { Button, Flex, InputNumber, Modal, Select, Space } from "antd";
import { useState } from "react";
import { Control, Controller, useFieldArray, useForm, UseFormSetValue, useWatch } from "react-hook-form";
import CustomTag from "./components/CustomTag";

interface FilterField {
  key: string;
  operator: string;
  values: (string | number | boolean)[];
  unit?: string;
}

interface FilterFormData {
  filters: FilterField[];
}

interface TransformedFilters {
  [key: string]: {
    operator: string;
    values: (string | number | boolean)[];
  };
}

const UnitMultipliers: Record<string, number> = {
  MiB: 1024 * 1024,
  GiB: 1024 * 1024 * 1024,
  TiB: 1024 * 1024 * 1024 * 1024,
  PiB: 1024 * 1024 * 1024 * 1024 * 1024,
};

const KeyMap: Record<string, string> = {
  Status: "status",
  "Parent ID": "parent_id",
  Size: "size",
  Activated: "activated",
};

const EmptyFilter: FilterField = {
  key: "",
  operator: "in",
  values: [],
  unit: "GiB",
};

const FilterOptions = ["Status", "Parent ID", "Size", "Activated"];
const SizeOptions = ["MiB", "GiB", "TiB", "PiB"];
const StatusOptions = ["Online", "Offline", "Rebuild", "Failed", "Missing"];
const ParentOptions = ["P-0", "P-1", "P-2"];
const ActivatedOptions = [
  { value: true, label: "On" },
  { value: false, label: "Off" },
];
const OperatorOptions = [
  { value: "in", label: "=" },
  { value: "ge", label: "≥" },
  { value: "le", label: "≤" },
];

function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [lastConfirmedFilters, setLastConfirmedFilters] = useState<FilterField[]>([]);

  return (
    <>
      <Button
        icon={<FilterOutlined />}
        type="link"
        onClick={() => setIsModalOpen(true)}
        style={{ border: isModalOpen ? "1px solid #1677FF" : "none" }}
      ></Button>
      {isModalOpen && (
        <FilterModal
          lastConfirmedFilters={lastConfirmedFilters}
          onSave={(newFilters) => setLastConfirmedFilters(newFilters)}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </>
  );
}

function FilterModal({
  lastConfirmedFilters,
  onSave,
  onClose,
}: {
  lastConfirmedFilters: FilterField[];
  onSave: (filters: FilterField[]) => void;
  onClose: () => void;
}) {
  const { control, handleSubmit, reset, watch, setValue } = useForm<FilterFormData>({
    defaultValues: {
      filters: lastConfirmedFilters.length > 0 ? lastConfirmedFilters : [EmptyFilter],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "filters",
  });

  const selectedKeys = watch("filters")
    .map((filter) => filter.key)
    .filter(Boolean);

  const filterRowCount = watch("filters").length;
  const isBelowRowLimit = filterRowCount < FilterOptions.length;

  const transformFilters = (filters: FilterField[]): TransformedFilters => {
    const result: TransformedFilters = {};

    filters.forEach((filter) => {
      if (!filter.key || !filter.values.length) return;

      const mappedKey = KeyMap[filter.key] ?? filter.key.toLowerCase();
      const operator = filter.operator || "in";

      let finalValues = filter.values;

      if (mappedKey === "size" && finalValues.length > 0) {
        const multiplier = filter.unit && UnitMultipliers[filter.unit] ? UnitMultipliers[filter.unit] : 1;
        finalValues = finalValues.map((val) => (typeof val === "number" ? val * multiplier : val));
      }

      result[mappedKey] = {
        operator,
        values: finalValues,
      };
    });

    return result;
  };

  const handleClearAll = () => {
    reset({ filters: [EmptyFilter] });
    onSave([]);
    onClose();
  };

  const handleCancel = () => {
    onClose();
  };

  const onSubmit = (data: FilterFormData) => {
    const validated = data.filters.filter((f) => f.key && Array.isArray(f.values) && f.values.length > 0);

    const finalData = validated.length > 0 ? validated : [EmptyFilter];

    const transformed = transformFilters(finalData);
    console.log("transformed Data =========", transformed);

    onSave(finalData);
    reset({ filters: finalData });
    onClose();
  };

  return (
    <Modal
      title="Filter"
      closable={false}
      open={true}
      footer={[
        <Button key="back" type="text" onClick={handleClearAll}>
          Clear all
        </Button>,
        <Button key="cancel" onClick={handleCancel}>
          Cancel
        </Button>,
        <Button key="confirm" type="primary" onClick={handleSubmit(onSubmit)}>
          Confirm
        </Button>,
      ]}
    >
      <form>
        <Space direction="vertical" size="middle" style={{ width: "100%" }}>
          {fields.map((field, index) => (
            <FilterRow
              key={field.id}
              index={index}
              control={control}
              onDelete={() => remove(index)}
              selectedKeys={selectedKeys}
              setValue={setValue}
            />
          ))}

          {isBelowRowLimit && (
            <Button type="link" icon={<PlusOutlined />} onClick={() => append(EmptyFilter)}>
              Add filter
            </Button>
          )}
        </Space>
      </form>
    </Modal>
  );
}

interface FilterRowProps {
  index: number;
  control: Control<FilterFormData>;
  onDelete: () => void;
  selectedKeys: string[];
  setValue: UseFormSetValue<FilterFormData>;
}
function FilterRow({ index, control, onDelete, selectedKeys, setValue }: FilterRowProps) {
  const filterKey = useWatch({ control, name: `filters.${index}.key` });

  return (
    <Flex gap="small">
      <Controller
        name={`filters.${index}.key`}
        control={control}
        defaultValue=""
        render={({ field }) => {
          const originalOnChange = field.onChange;
          return (
            <Select
              {...field}
              placeholder="Filter"
              style={{ width: 120 }}
              options={FilterOptions.map((option) => ({
                value: option,
                label: option,
                disabled: selectedKeys.includes(option) && option !== filterKey,
              }))}
              onChange={(newKey) => {
                originalOnChange(newKey);
                if (newKey === "Activated") {
                  setValue(`filters.${index}.values`, [true]);
                } else if (newKey === "Size") {
                  setValue(`filters.${index}.operator`, "ge");
                }
              }}
            />
          );
        }}
      />

      <Controller
        name={`filters.${index}.operator`}
        control={control}
        render={({ field }) => {
          const isSize = filterKey === "Size";
          return <>{isSize && <Select {...field} style={{ width: 60 }} options={OperatorOptions} />}</>;
        }}
      />

      <Controller
        name={`filters.${index}.values`}
        control={control}
        defaultValue={filterKey === "Activated" ? [true] : []}
        render={({ field }) => {
          switch (filterKey) {
            case "Status":
              return (
                <Select
                  {...field}
                  mode="multiple"
                  style={{ width: 180 }}
                  options={StatusOptions.map((option) => ({
                    value: option,
                    label: option,
                  }))}
                  tagRender={CustomTag}
                />
              );
            case "Parent ID":
              return (
                <Select
                  {...field}
                  mode="multiple"
                  style={{ width: 180 }}
                  options={ParentOptions.map((option) => ({
                    value: option,
                    label: option,
                  }))}
                  tagRender={CustomTag}
                />
              );
            case "Size":
              return (
                <InputNumber
                  style={{ width: 180 }}
                  placeholder="enter size"
                  value={typeof field.value[0] === "number" ? field.value[0] : undefined}
                  onChange={(value) => field.onChange([value])}
                />
              );
            case "Activated":
              return (
                <Select
                  {...field}
                  style={{ width: 180 }}
                  options={ActivatedOptions}
                  onChange={(value) => field.onChange([value])}
                />
              );
            default:
              return <Select {...field} disabled style={{ width: 180 }} placeholder="Select" />;
          }
        }}
      />

      <Controller
        name={`filters.${index}.unit`}
        control={control}
        defaultValue="GiB"
        render={({ field }) => {
          const isSize = filterKey === "Size";
          return (
            <>
              {isSize && (
                <Select {...field} style={{ width: 80 }} options={SizeOptions.map((s) => ({ value: s, label: s }))} />
              )}
            </>
          );
        }}
      />

      <Button type="text" icon={<DeleteOutlined />} disabled={!filterKey} onClick={onDelete} />
    </Flex>
  );
}

export default App;
