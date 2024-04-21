import { PassData, blankPass, Msg } from "../types";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { useAppContext } from "../App";

const activeBodyTemplate = (rowData: PassData) => {
  return <i className={rowData.active ? "pi pi-check" : "pi pi-times"} />;
};

const passtypeTemplate = (rowData: PassData) => rowData.passtype?.name;

export function SearchResults() {
  const { searchData, selectedPass, setSelectedPass } = useAppContext();
  return (
    <DataTable
      className="search-results"
      size="small" // showGridlines
      scrollable
      scrollHeight="87%"
      paginator
      rows={32}
      // virtualScrollerOptions={{ lazy: true, itemSize: 46, delay: 200, showLoader: true }}
      value={searchData || []}
      metaKeySelection={false}
      selectionMode="single"
      selection={selectedPass}
      onSelectionChange={(e) =>
        setSelectedPass({ type: Msg.Replace, data: e.value || blankPass })
      }
      dataKey="id"
    >
      <Column field="first_name" header="First Name" style={{ width: "35%" }} />
      <Column field="last_name" header="Last Name" style={{ width: "35%" }} />
      <Column
        field="passtype"
        body={passtypeTemplate}
        header="Type"
        style={{ width: "20%" }}
      />
      <Column field="remaining" header="Remaining" style={{ width: "10%" }} />
      <Column
        field="active"
        header="Active"
        body={activeBodyTemplate}
        style={{ width: "10%" }}
      />
    </DataTable>
  );
}
