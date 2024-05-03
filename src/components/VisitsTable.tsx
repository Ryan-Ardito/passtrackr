import { useQuery } from "@tanstack/react-query";
import { getVisits } from "../api/api";
import { useAppContext } from "../AppContext";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { VisitsRow } from "../types";

const createdAtTemplate = (rowData: VisitsRow): string | undefined => {
  let createdAt = undefined;
  if (rowData?.created_at) {
    createdAt = new Date(rowData.created_at * 1000).toLocaleString();
  }
  return createdAt;
};

export function VisitsTable() {
  const { selectedPass } = useAppContext();

  const { data: visits } = useQuery({
    queryKey: ["visits", selectedPass.guest_id],
    queryFn: () => getVisits(selectedPass.guest_id),
  });

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
