import { PassData, blankPass } from "../types";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { useAppContext } from "../AppContext";

const activeBodyTemplate = (rowData: PassData) => {
  return <i className={rowData.active ? "pi pi-check" : "pi pi-times"} />;
};

const remainingBodyTemplate = (rowData: PassData) => {
  return (
    <>
      {rowData.passtype.code === "lifetime" ? (
        <img src="src/assets/infinity.png" height={"14px"} />
      ) : (
        rowData.remaining_uses
      )}
    </>
  );
};

const passtypeTemplate = (rowData: PassData) => rowData?.passtype?.name;

export function SearchResults() {
  const { searchData, selectedPass, setSelectedPass } = useAppContext();
  return (
    <DataTable
      id="search-results"
      className="flex-box flex-col"
      size="small"
      showGridlines
      scrollable
      scrollHeight="100%"
      paginator
      rows={32}
      // virtualScrollerOptions={{ lazy: true, itemSize: 46, delay: 500, showLoader: true }}
      // virtualScrollerOptions={{ itemSize: 46 }}
      value={searchData}
      metaKeySelection={false}
      selectionMode="single"
      selection={selectedPass}
      onSelectionChange={(e) => setSelectedPass(e.value || blankPass)}
      dataKey="pass_id"
    >
      <Column field="first_name" header="First Name" style={{ width: "35%" }} />
      <Column field="last_name" header="Last Name" style={{ width: "35%" }} />
      <Column
        field="passtype"
        body={passtypeTemplate}
        header="Type"
        style={{ width: "20%" }}
      />
      <Column
        field="remaining_uses"
        header="Remaining"
        body={remainingBodyTemplate}
        style={{ width: "10%" }}
      />
      <Column
        field="active"
        header="Active"
        body={activeBodyTemplate}
        style={{ width: "10%" }}
      />
    </DataTable>
  );
}
