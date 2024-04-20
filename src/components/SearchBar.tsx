import { InputText } from "primereact/inputtext"
import { Button } from "primereact/button"

interface ChildProps {
  setSearch: React.Dispatch<React.SetStateAction<string>>,
  loading: boolean,
}

export function SearchBar({ setSearch, loading }: ChildProps) {
  return (
    <form className="searchbar">
      <InputText id="search-input" placeholder="Search passes..." autoFocus
        onChange={(e) => setSearch(e.currentTarget.value)}
      />
      <Button type="submit" label="Search" loading={loading} />
    </form>
  )
}