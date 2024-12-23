import { PlusOutlined } from "@ant-design/icons";
import { Button, Modal, Space } from "antd";
import { useFieldArray, useForm } from "react-hook-form";
import { EmptyFilter, FilterOptions, KeyMap, UnitMultipliers } from "../../constants/filterOptions";
import { FilterField, FilterFormData, TransformedFilters } from "../../types";
import FilterRow from "./FilterRow";

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

export default FilterModal;
