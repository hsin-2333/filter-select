import { DeleteOutlined } from "@ant-design/icons";
import { Button, Flex, InputNumber, Select, Space } from "antd";
import { Control, Controller, UseFormSetValue, useWatch } from "react-hook-form";
import CustomTag from "../../components/CustomTag";
import {
  ActivatedOptions,
  FilterOptions,
  OperatorOptions,
  ParentOptions,
  SizeOptions,
  StatusOptions,
} from "../../constants/filterOptions";
import { FilterFormData } from "../../types";

interface FilterRowProps {
  index: number;
  control: Control<FilterFormData>;
  onDelete: () => void;
  selectedKeys: string[];
  setValue: UseFormSetValue<FilterFormData>;
}

function FilterRow({ index, control, onDelete, selectedKeys, setValue }: FilterRowProps) {
  const filterKey = useWatch({ control, name: `filters.${index}.key` });

  const renderFilterValues = () => {
    switch (filterKey) {
      case "Size":
        return <SizeFilterValues index={index} control={control} />;
      case "Status":
        return (
          <SelectFilterValues
            index={index}
            control={control}
            options={StatusOptions.map((option) => ({ value: option, label: option }))}
            multiple
          />
        );
      case "Parent ID":
        return (
          <SelectFilterValues
            index={index}
            control={control}
            options={ParentOptions.map((option) => ({ value: option, label: option }))}
            multiple
          />
        );
      case "Activated":
        return <SelectFilterValues index={index} control={control} options={ActivatedOptions} />;
      default:
        return <Select disabled style={{ width: "100%" }} placeholder="Select" />;
    }
  };

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
              value={field.value === "" ? undefined : field.value}
              placeholder="Filter"
              style={{ width: 136 }}
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

      <div style={{ flexGrow: 1 }}>{renderFilterValues()}</div>

      <Button type="text" icon={<DeleteOutlined />} disabled={!filterKey} onClick={onDelete} />
    </Flex>
  );
}

const SizeFilterValues = ({ index, control }: { index: number; control: Control<FilterFormData> }) => {
  return (
    <Space.Compact style={{ display: "flex", width: "100%" }}>
      <Controller
        name={`filters.${index}.operator`}
        control={control}
        render={({ field }) => <Select {...field} style={{ width: 80 }} options={OperatorOptions} />}
      />
      <Controller
        name={`filters.${index}.values`}
        control={control}
        render={({ field }) => (
          <InputNumber
            style={{ flexGrow: 1 }}
            placeholder="enter size number"
            value={typeof field.value[0] === "number" ? field.value[0] : undefined}
            onChange={(value) => field.onChange([value])}
          />
        )}
      />
      <Controller
        name={`filters.${index}.unit`}
        control={control}
        defaultValue="GiB"
        render={({ field }) => (
          <Select {...field} style={{ width: 80 }} options={SizeOptions.map((s) => ({ value: s, label: s }))} />
        )}
      />
    </Space.Compact>
  );
};

const SelectFilterValues = ({
  index,
  control,
  options,
  multiple = false,
}: {
  index: number;
  control: Control<FilterFormData>;
  options: { value: string | boolean; label: string }[];
  multiple?: boolean;
}) => (
  <Controller
    name={`filters.${index}.values`}
    control={control}
    render={({ field }) => (
      <Select
        {...field}
        style={{ width: "100%" }}
        mode={multiple ? "multiple" : undefined}
        options={options}
        tagRender={multiple ? CustomTag : undefined}
        onChange={multiple ? field.onChange : (value) => field.onChange([value])}
      />
    )}
  />
);
export default FilterRow;
