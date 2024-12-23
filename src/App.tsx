import { FilterOutlined } from "@ant-design/icons";
import { Button, Dropdown } from "antd";
import { useEffect, useState } from "react";
import FilterDropdownContent from "./components/FilterDropdown/FilterDropdownContent";
import { EmptyFilter } from "./constants/filterOptions";
import { FilterField } from "./types";
import { decodeFilters, encodeFilters } from "./utils/urlFunctions";

function App() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [lastConfirmedFilters, setLastConfirmedFilters] = useState<FilterField[]>(() => {
    const params = new URLSearchParams(window.location.search);
    const filterParam = params.get("filters");
    return filterParam ? decodeFilters(filterParam) : [EmptyFilter];
  });

  const updateURL = (filters: FilterField[]) => {
    const encodedFilters = encodeFilters(filters);
    const newURL = encodedFilters ? `${window.location.pathname}?filters=${encodedFilters}` : window.location.pathname;
    window.history.pushState({}, "", newURL);
  };

  const handleSaveFilters = (newFilters: FilterField[]) => {
    setLastConfirmedFilters(newFilters);
    updateURL(newFilters);
  };

  useEffect(() => {
    const handlePopState = () => {
      const params = new URLSearchParams(window.location.search);
      const filterParam = params.get("filters");
      setLastConfirmedFilters(filterParam ? decodeFilters(filterParam) : [EmptyFilter]);
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  const hasFilters = lastConfirmedFilters.length > 0 && lastConfirmedFilters[0].key !== "";

  return (
    <Dropdown
      trigger={["click"]}
      placement="bottomLeft"
      overlayStyle={{
        width: 500,
        padding: 16,
        boxShadow:
          "0px 3px 6px -4px rgba(0, 0, 0, 0.12), 0px 6px 16px 0px rgba(0, 0, 0, 0.08), 0px 9px 28px 8px rgba(0, 0, 0, 0.05)",
        borderRadius: 8,
      }}
      dropdownRender={() => (
        <FilterDropdownContent
          lastConfirmedFilters={lastConfirmedFilters}
          onSave={handleSaveFilters}
          onClose={() => setIsDropdownOpen(false)}
        />
      )}
      open={isDropdownOpen}
      onOpenChange={(open) => setIsDropdownOpen(open)}
      arrow
    >
      <Button
        icon={<FilterOutlined />}
        type="link"
        style={{ border: hasFilters ? "1px solid #1677FF" : "none" }}
      ></Button>
    </Dropdown>
  );
}

export default App;
