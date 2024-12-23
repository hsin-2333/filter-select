import { DeleteOutlined } from "@ant-design/icons";
import { Button, Flex, InputNumber, Select } from "antd";
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

export default FilterRow;
