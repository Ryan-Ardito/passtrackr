import { InputText } from "primereact/inputtext";
import { useAppContext } from "../AppContext";
import { Button } from "primereact/button";
import { InvalidateQueryFilters, useQueryClient } from "@tanstack/react-query";
import { FormEvent } from "react";
import { debounce } from "lodash";

export function SearchBar() {
  const { search, setSearch, isSearchFetching } = useAppContext();
  const debouncedSetSearch = debounce(setSearch, 400);
  const queryClient = useQueryClient();

  const handleSearchButton = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // Prevents the default form submission behavior
    queryClient.invalidateQueries(["search", search] as InvalidateQueryFilters);
  };

  return (
    <form onSubmit={handleSearchButton}>
      <div className="flex-box">
        <span id="searchbar" className="p-input-icon-right">
          {isSearchFetching && <i className="pi pi-spin pi-spinner" />}
          <InputText
            id="search-input"
            className="p-inputtext-lg"
            placeholder="Search passholder..."
            autoFocus
            onChange={(e) => debouncedSetSearch(e.currentTarget.value)}
          />
        </span>
        <Button
          type="submit"
          label="Search"
          style={{ width: "6rem" }}
          onSubmit={() => {}}
        />
      </div>
    </form>
  );
}
