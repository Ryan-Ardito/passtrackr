import { useQuery } from "@tanstack/react-query";
import { getPayments } from "../api/api";
import { useAppContext } from "../AppContext";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";

export function PaymentsTable() {
  const { selectedPass } = useAppContext();

  const { data: visits } = useQuery({
    queryKey: ["payments", selectedPass.guest_id],
    queryFn: () => getPayments(selectedPass.guest_id),
  });

  return (
    <DataTable value={visits} size="small">
      {/* <Column field="payment_id" header="ID" /> */}
      <Column field="pass_id" header="Pass ID" />
      <Column field="pay_method" header="Method" />
      <Column field="amount_paid" header="Amount Paid" />
      <Column field="creator" header="Creator" />
      <Column field="creation_time" header="Time" />
    </DataTable>
  );
}
