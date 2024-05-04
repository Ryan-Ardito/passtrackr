import { PassData, blankPass } from "../types";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { useAppContext } from "../AppContext";

const remainingBodyTemplate = (rowData: PassData) => {
  return (
    <>
      {rowData.passtype.code === "Unlimited" && (
        <img src="src/assets/infinity.png" height={"12x"} />
      )}
      {rowData.passtype.code === "Punch" && rowData.remaining_uses}
      {rowData.passtype.code === "Annual" &&
        (rowData.active ? (
          <i className="pi pi-calendar" />
        ) : (
          <i className="pi pi-times" />
        ))}
      {rowData.passtype.code === "6 Month" &&
        (rowData.active ? (
          <i className="pi pi-calendar" />
        ) : (
          <i className="pi pi-times" />
        ))}
      {rowData.passtype.code === "Free Pass" &&
        (rowData.active ? (
          <i className="pi pi-clock" />
        ) : (
          <i className="pi pi-times" />
        ))}
      {rowData.passtype.code === "Facial" && rowData.remaining_uses}
    </>
  );
};

const passtypeTemplate = (rowData: PassData) => rowData?.passtype?.name;

const passholderTemplate = (rowData: PassData) => {
  return `${rowData?.first_name} ${rowData?.last_name}`;
};

export function SearchResults() {
  const { searchData, selectedPass, setSelectedPass } = useAppContext();
  return (
    <div id="search-results">
      <DataTable
        dataKey="pass_id"
        className="flex-box flex-col"
        size="large"
        // showGridlines
        scrollable
        // scrollHeight="90%"
        paginator
        rows={50}
        alwaysShowPaginator={false}
        // virtualScrollerOptions={{ lazy: true, itemSize: 46, delay: 500, showLoader: true }}
        // virtualScrollerOptions={{ itemSize: 46 }}
        value={searchData}
        metaKeySelection={false}
        selectionMode="single"
        selection={selectedPass}
        onSelectionChange={(e) => setSelectedPass(e.value || blankPass)}
      >
        <Column
          field="passholder"
          body={passholderTemplate}
          header="Passholder"
          style={{ width: "45%" }}
        />
        <Column field="town" header="Town" style={{ width: "30%" }} />
        <Column
          field="passtype"
          body={passtypeTemplate}
          header="Type"
          style={{ width: "15%" }}
        />
        <Column
          field="remaining_uses"
          header="Uses"
          body={remainingBodyTemplate}
          style={{ width: "10%" }}
        />
      </DataTable>
    </div>
  );
}
