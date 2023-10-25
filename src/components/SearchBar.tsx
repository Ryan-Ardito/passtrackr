import { FormEvent } from "react"
import { InputText } from "primereact/inputtext"
import { Button } from "primereact/button"

interface ChildProps {
  setSearch: React.Dispatch<React.SetStateAction<string>>,
  handleSubmit: (arg: FormEvent) => void,
}

export function SearchBar({ setSearch, handleSubmit }: ChildProps) {
  return (
    <form
      className="searchbar"
      onSubmit={handleSubmit}
    >
      <InputText
        autoFocus
        id="search-input"
        onChange={(e) => setSearch(e.currentTarget.value)}
        placeholder="Search passholders..."
      />
      <Button type="submit" label="Search" />
    </form>
  )
}