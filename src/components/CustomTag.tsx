import { Tag } from "antd";
import type { CustomTagProps } from "rc-select/lib/BaseSelect";

const CustomTag = (props: CustomTagProps) => {
  const { label, value, closable, onClose } = props;

  const getColor = () => {
    switch (value) {
      case "Online":
        return "green";
      case "Failed":
      case "Missing":
        return "red";
      case "Offline":
        return "orange";
      default:
        return "processing";
    }
  };

  return (
    <Tag color={getColor()} closable={closable} onClose={onClose} style={{ marginBottom: 4 }}>
      {label}
    </Tag>
  );
};

export default CustomTag;
