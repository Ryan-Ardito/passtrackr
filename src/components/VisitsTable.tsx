import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { VisitsRow } from "../types";

const createdAtTemplate = (rowData: VisitsRow): string | undefined => {
  let createdAt = undefined;
  if (rowData?.created_at) {
    createdAt = new Date(rowData.created_at).toLocaleString();
  }
  return createdAt;
};

export function VisitsTable({ visits }: { visits: VisitsRow[] | undefined }) {
  return (
    <DataTable
      dataKey="visit_id"
      value={visits}
      size="small"
      scrollable
      showGridlines
      style={{ display: "grid", maxHeight: "100%", paddingBottom: "45px" }}
    >
      {/* <Column field="visit_id" header="ID" /> */}
      {/* <Column field="pass_id" header="Pass" /> */}
      <Column field="created_at" header="Date" body={createdAtTemplate} />
    </DataTable>
  );
}
