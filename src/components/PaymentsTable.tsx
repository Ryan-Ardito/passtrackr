import { useQuery } from "@tanstack/react-query";
import { getPayments } from "../api/api";
import { useAppContext } from "../AppContext";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { PaymentRow } from "../types";

const creationTimeTemplate = (rowData: PaymentRow): string | undefined => {
  let creationTime = undefined;
  if (rowData?.creation_time) {
    creationTime = new Date(rowData.creation_time * 1000).toDateString();
  }
  return creationTime;
};

export function PaymentsTable() {
  const { selectedPass } = useAppContext();

  const { data: visits } = useQuery({
    queryKey: ["payments", selectedPass.guest_id],
    queryFn: () => getPayments(selectedPass.guest_id),
  });

  return (
    <DataTable
      dataKey="payment_id"
      value={visits}
      size="small"
      scrollable
      style={{ height: "100%" }}
    >
      {/* <Column field="payment_id" header="ID" /> */}
      {/* <Column field="pass_id" header="Pass" /> */}
      <Column field="creation_time" header="Date" body={creationTimeTemplate} />
      <Column field="amount_paid" header="Paid" />
      <Column field="pay_method" header="Method" />
      <Column field="creator" header="Creator" />
    </DataTable>
  );
}
