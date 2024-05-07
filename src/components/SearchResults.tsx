import { SearchPassData, blankPass } from "../types";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { useAppContext } from "../AppContext";

const RemainingIcon = ({ expires_at }: { expires_at: number }) => {
  return Date.now() > expires_at ? (
    <i className="pi pi-times" />
  ) : Date.now() + 2629800 * 1000 > expires_at ? (
    <i className="pi pi-calendar-clock" />
  ) : (
    <i className="pi pi-calendar" />
  );
};

const remainingBodyTemplate = (rowData: SearchPassData) => {
  return (
    <>
      {!rowData.active ? (
        <i className="pi pi-ban" />
      ) : (
        <>
          {rowData.passtype?.code === "Unlimited" && (
            <img src="src/assets/infinity.png" height={"12x"} />
          )}
          {rowData.passtype?.code === "Punch" && rowData.remaining_uses}
          {rowData.passtype?.code === "Annual" && rowData.expires_at && (
            <RemainingIcon expires_at={rowData.expires_at} />
          )}
          {rowData.passtype?.code === "6 Month" && rowData.expires_at && (
            <RemainingIcon expires_at={rowData.expires_at} />
          )}
          {rowData.passtype?.code === "Free" && <i className="pi pi-key" />}
          {rowData.passtype?.code === "Facial" && rowData.remaining_uses}
        </>
      )}
    </>
  );
};

const passtypeTemplate = (rowData: SearchPassData) => rowData?.passtype?.name;

const passholderTemplate = (rowData: SearchPassData) => {
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
          style={{ width: "40%" }}
        />
        <Column field="town" header="Town" style={{ width: "30%" }} />
        <Column
          field="passtype"
          body={passtypeTemplate}
          header="Type"
          style={{ width: "20%" }}
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
