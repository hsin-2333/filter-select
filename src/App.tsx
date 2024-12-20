import { DeleteOutlined, FilterOutlined, PlusOutlined } from "@ant-design/icons";
import { Button, Flex, Input, Modal, Select, Space } from "antd";
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

function App() {
  return (
    <>
      <h3>Table</h3>
      <FilterTable />
    </>
  );
}

const FilterOptions = ["Status", "Parent ID", "Size", "Activated"];
const SizeOptions = ["MiB", "GiB", "TiB", "PiB"];
const StatusOptions = ["Online", "Offline", "Rebuild", "Failed", "Missing"];
const ActivatedOptions = ["On", "Off"];
const OperatorOptions = [
  { value: "in", label: "=" },
  { value: "ge", label: "≥" },
  { value: "le", label: "≤" },
];

function FilterTable() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { control, handleSubmit } = useForm<FilterFormData>({
    defaultValues: {
      filters: [{ key: "", operator: "in", values: [], unit: undefined }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "filters",
  });

  return (
    <>
      <FilterOutlined onClick={() => setIsModalOpen(!isModalOpen)} />
      <Modal
        title="Filter"
        closable={false}
        open={isModalOpen}
        onOk={() => setIsModalOpen(false)}
        footer={[
          <Button key="back" type="text" onClick={() => setIsModalOpen(false)}>
            Clear all
          </Button>,
          <Button key="cancel" onClick={() => setIsModalOpen(false)}>
            Cancel
          </Button>,
          <Button key="confirm" type="primary" onClick={handleSubmit((data) => console.log(data))}>
            Confirm
          </Button>,
        ]}
      >
        <form>
          <Space direction="vertical" size="middle" style={{ width: "100%" }}>
            {fields.map((field, index) => (
              <FilterRow key={field.id} index={index} control={control} onDelete={() => remove(index)} />
            ))}
            <Button
              icon={<PlusOutlined />}
              type="link"
              onClick={() => append({ key: "", operator: "", values: [], unit: undefined })}
            >
              Add filter
            </Button>
          </Space>
        </form>
      </Modal>
    </>
  );
}

interface FilterRowProps {
  index: number;
  control: Control<FilterFormData>;
  onDelete: () => void;
}
function FilterRow({ index, control, onDelete }: FilterRowProps) {
  const filterKey = useWatch({ control, name: `filters.${index}.key` });
  const renderSelectorByStatus = () => {
    switch (filterKey) {
      case "Status":
        return (
          <Controller
            name={`filters.${index}.values`}
            control={control}
            render={({ field }) => (
              <Select
                {...field}
                mode="multiple"
                style={{ width: "100%" }}
                options={StatusOptions.map((option) => ({
                  value: option,
                  label: option,
                }))}
              />
            )}
          />
        );

      case "Parent ID":
        return (
          <Controller
            name={`filters.${index}.values`}
            control={control}
            render={({ field }) => (
              <Select
                {...field}
                mode="multiple"
                style={{ width: "100%" }}
                options={StatusOptions.map((option) => ({
                  value: option,
                  label: option,
                }))}
              />
            )}
          />
        );
      case "Size":
        return (
          <Space.Compact
            style={{
              width: "100%",
            }}
          >
            <Select defaultValue="≥" options={OperatorOptions} />
            <Input defaultValue="6.38" />
            <Select placeholder="GIB" options={SizeOptions.map((option) => ({ value: option, label: option }))} />
          </Space.Compact>
        );
      case "Activated":
        return (
          <Controller
            name={`filters.${index}.values`}
            control={control}
            render={({ field }) => (
              <Select
                {...field}
                style={{ width: "100%" }}
                options={ActivatedOptions.map((option) => ({
                  value: option,
                  label: option,
                }))}
              />
            )}
          />
        );

      default:
        return <Select style={{ width: "100%" }} disabled placeholder="Select" />;
    }
  };

  return (
    <>
      <Flex gap="small">
        <Controller
          name={`filters.${index}.key`}
          control={control}
          render={({ field }) => (
            <Select
              {...field}
              placeholder="Filter"
              value={field.value || undefined}
              options={FilterOptions.map((option) => ({ value: option, label: option }))}
            />
          )}
        />

        {renderSelectorByStatus()}

        <Button icon={<DeleteOutlined />} type="link" onClick={onDelete} />
      </Flex>
    </>
  );
}
export default App;
