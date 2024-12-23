import { FilterOutlined } from "@ant-design/icons";
import { Button } from "antd";
import { useEffect, useState } from "react";
import FilterModal from "./components/FilterModal";
import { EmptyFilter } from "./constants/filterOptions";
import { FilterField } from "./types";
import { decodeFilters, encodeFilters } from "./utils/urlFunctions";

function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);
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
          onSave={handleSaveFilters}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </>
  );
}

export default App;
