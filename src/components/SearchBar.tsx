import { InputText } from "primereact/inputtext";
import { useAppContext } from "../AppContext";

export function SearchBar() {
  const { debouncedSetSearch, isSearchFetching } = useAppContext();

  return (
    <span className="searchbar p-input-icon-right">
      {isSearchFetching && <i className="pi pi-spin pi-spinner" />}
      <InputText
        id="search-input"
        placeholder="Search passes..."
        autoFocus
        onChange={(e) => debouncedSetSearch(e.currentTarget.value)}
      />
    </span>
  );
}
