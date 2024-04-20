import { InputText } from "primereact/inputtext"

interface ChildProps {
  setSearch: React.Dispatch<React.SetStateAction<string>>,
  loading: boolean,
}

export function SearchBar({ setSearch, loading }: ChildProps) {
  return (
    <span className="searchbar p-input-icon-right">
      {loading && <i className="pi pi-spin pi-spinner" />}
      <InputText id="search-input" placeholder="Search passes..." autoFocus
        onChange={(e) => setSearch(e.currentTarget.value)}
      />
    </span>
  )
}