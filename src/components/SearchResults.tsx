import { HolderData, HolderAction, blankHolder } from "../App";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
// import { useContext } from "react";

const activeBodyTemplate = (rowData: HolderData) => {
  return (
    <i className={rowData.active ? "pi pi-check" : "pi pi-times"} />
  )
}

const passtypeTemplate = (rowData: HolderData) => {
  return (
    rowData.passtype?.code
  )
}

interface ChildProps {
  passholders: HolderData[],
  selectedHolder: HolderData,
  setSelectedHolder: React.Dispatch<HolderAction>,
}

export function SearchResults({ passholders, selectedHolder, setSelectedHolder }: ChildProps) {

  return (
    <DataTable showGridlines className="search-results" size="small"
      scrollable scrollHeight="87%" paginator rows={32}
      // virtualScrollerOptions={{ itemSize: 46 }}  // broken
      value={passholders} metaKeySelection={false} selectionMode="single" selection={selectedHolder}
      onSelectionChange={(e) => setSelectedHolder({ type: "replace", data: e.value || blankHolder })} dataKey="id"
    >
      <Column field="first_name" header="First Name" style={{ width: "35%" }} />
      <Column field="last_name" header="Last Name" style={{ width: "35%" }} />
      <Column field="passtype" body={passtypeTemplate} header="Type" style={{ width: "20%" }} />
      <Column field="remaining" header="Remaining" style={{ width: "10%" }} />
      <Column field="active" header="Active" body={activeBodyTemplate} style={{ width: "10%" }} />
    </DataTable>
  )
}