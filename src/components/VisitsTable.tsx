import { useQuery } from "@tanstack/react-query";
import { getVisits } from "../api/api";
import { useAppContext } from "../AppContext";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";

export function VisitsTable() {
  const { selectedPass } = useAppContext();

  const { data: visits } = useQuery({
    queryKey: ["visits", selectedPass.pass_id],
    queryFn: () => getVisits(selectedPass.pass_id),
  });

  return (
    <DataTable value={visits} size="small">
      <Column field="visit_id" header="Visit ID" />
      <Column field="pass_id" header="Pass ID" />
      <Column field="creation_time" header="Time" />
    </DataTable>
  );
}
