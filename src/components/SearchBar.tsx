import { FormEvent } from "react"
import { InputText } from "primereact/inputtext"
import { Button } from "primereact/button"

interface ChildProps {
  setSearch: React.Dispatch<React.SetStateAction<string>>,
  handleSubmit: (arg: FormEvent) => void,
  loading: boolean,
}

export function SearchBar({ setSearch, handleSubmit, loading }: ChildProps) {
  return (
    <form className="searchbar" onSubmit={handleSubmit} >
      <InputText id="search-input" placeholder="Search passes..." autoFocus
        onChange={(e) => setSearch(e.currentTarget.value)}
      />
      <Button type="submit" label="Search" loading={loading} />
    </form>
  )
}