import { InputText } from "primereact/inputtext";
import { useAppContext } from "../AppContext";

export function SearchBar() {
  const { debouncedSetSearch, isSearchFetching } = useAppContext();

  return (
    <span id="searchbar" className="p-input-icon-right">
      {isSearchFetching && <i className="pi pi-spin pi-spinner" />}
      <InputText
        id="search-input"
        className="p-inputtext-lg"
        placeholder="Search passes..."
        autoFocus
        onChange={(e) => debouncedSetSearch(e.currentTarget.value)}
      />
    </span>
  );
}
