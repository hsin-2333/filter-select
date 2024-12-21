import { DeleteOutlined, FilterOutlined, PlusOutlined } from "@ant-design/icons";
import { Button, Flex, InputNumber, Modal, Select, Space } from "antd";
import { useState } from "react";
import { Control, Controller, useFieldArray, useForm, useWatch } from "react-hook-form";

interface FilterField {
  key: string;
  operator: string;
  values: (string | number)[];
  unit?: string;
}

interface FilterFormData {
  filters: FilterField[];
}

const EmptyFilter: FilterField = {
  key: "",
  operator: "in",
  values: [],
  unit: "GiB",
};

const FilterOptions = ["Status", "Parent ID", "Size", "Activated"];
const SizeOptions = ["MiB", "GiB", "TiB", "PiB"];
const StatusOptions = ["Online", "Offline", "Rebuild", "Failed", "Missing"];
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
      <Button icon={<FilterOutlined />} type="link" onClick={() => setIsModalOpen(true)}></Button>
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
  const { control, handleSubmit, reset } = useForm<FilterFormData>({
    defaultValues: {
      filters: lastConfirmedFilters.length > 0 ? lastConfirmedFilters : [EmptyFilter],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "filters",
  });

  console.log(" fields ==============", fields);

  const handleClearAll = () => {
    reset({ filters: [EmptyFilter] });
    onSave([]);
    onClose();
  };

  const handleCancel = () => {
    onClose();
  };

  const onSubmit = (data: FilterFormData) => {
    const validated = data.filters.filter((f) => {
      return f.key && Array.isArray(f.values) && f.values.length > 0;
    });
    const finalData = validated.length > 0 ? validated : [EmptyFilter];

    onSave(finalData);
    reset({ filters: finalData });
    onClose();

    console.log("data ===========", data);
    console.log("finalData =========", finalData);
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
            <FilterRow key={field.id} index={index} control={control} onDelete={() => remove(index)} />
          ))}

          <Button type="link" icon={<PlusOutlined />} onClick={() => append(EmptyFilter)}>
            Add filter
          </Button>
        </Space>
      </form>
    </Modal>
  );
}

interface FilterRowProps {
  index: number;
  control: Control<FilterFormData>;
  onDelete: () => void;
}
function FilterRow({ index, control, onDelete }: FilterRowProps) {
  const filterKey = useWatch({ control, name: `filters.${index}.key` });

  return (
    <Flex gap="small">
      <Controller
        name={`filters.${index}.key`}
        control={control}
        defaultValue=""
        render={({ field }) => (
          <Select
            {...field}
            placeholder="Filter"
            style={{ width: 120 }}
            options={FilterOptions.map((v) => ({ value: v, label: v }))}
          />
        )}
      />

      <Controller
        name={`filters.${index}.operator`}
        control={control}
        defaultValue="in"
        render={({ field }) => {
          const isSize = filterKey === "Size";
          return <>{isSize && <Select {...field} style={{ width: 60 }} options={OperatorOptions} />}</>;
        }}
      />

      <Controller
        name={`filters.${index}.values`}
        control={control}
        defaultValue={[]}
        render={({ field }) => {
          switch (filterKey) {
            case "Status":
            case "Parent ID":
              return (
                <Select
                  {...field}
                  mode="multiple"
                  style={{ width: 180 }}
                  options={StatusOptions.map((option) => ({
                    value: option,
                    label: option,
                  }))}
                />
              );
            case "Size":
              return (
                <InputNumber
                  style={{ width: 180 }}
                  placeholder="enter size"
                  value={field.value[0] ?? undefined}
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

      <Button type="link" icon={<DeleteOutlined />} onClick={onDelete} />
    </Flex>
  );
}

export default App;
