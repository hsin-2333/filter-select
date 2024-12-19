import { DeleteOutlined, FilterOutlined, PlusOutlined } from "@ant-design/icons";
import { Button, Flex, Input, Modal, Select, Space } from "antd";
import { useState } from "react";
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

function FilterTable() {
  const [isModalOpen, setIsModalOpen] = useState(false);
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
          <Button key="submit" onClick={() => setIsModalOpen(false)}>
            Cancel
          </Button>,
          <Button key="submit" type="primary" onClick={() => setIsModalOpen(false)}>
            Confirm
          </Button>,
        ]}
      >
        <Space direction="vertical" size="middle" style={{ width: "100%" }}>
          <Filters />
          <Button icon={<PlusOutlined />} type="link">
            Add filter
          </Button>
        </Space>
      </Modal>
    </>
  );
}

const Filters = () => {
  return (
    <>
      <Flex gap="small">
        <Select placeholder="Filter" options={FilterOptions.map((option) => ({ value: option, label: option }))} />
        <Select
          mode="multiple"
          disabled
          allowClear
          style={{
            width: "100%",
          }}
          placeholder="Select"
          defaultValue={["a10", "c12"]}
          // onChange={}
          // options={}
        />

        <Button icon={<DeleteOutlined />} type="link" disabled />
      </Flex>

      <Flex gap="small">
        <Select placeholder="Filter" options={FilterOptions.map((option) => ({ value: option, label: option }))} />
        <Space.Compact
          style={{
            width: "100%",
          }}
        >
          <Select
            defaultValue="≥"
            options={[
              { value: "≥", label: "≥" },
              { value: "≤", label: "≤" },
            ]}
          />
          <Input defaultValue="6.38" />
          <Select placeholder="GIB" options={SizeOptions.map((option) => ({ value: option, label: option }))} />
        </Space.Compact>

        <Button icon={<DeleteOutlined />} type="link" disabled />
      </Flex>
    </>
  );
};
export default App;
