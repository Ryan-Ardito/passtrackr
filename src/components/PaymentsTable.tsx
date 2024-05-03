import { useQuery } from "@tanstack/react-query";
import { getPayments } from "../api/api";
import { useAppContext } from "../AppContext";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { PaymentRow } from "../types";

const amountPaidTemplate = (rowData: PaymentRow): string | undefined => {
  return rowData.amount_paid?.toLocaleString("en-US", {
    // minimumFractionDigits: 2,
    maximumFractionDigits: 0,
  });
};

const createdAtTemplate = (rowData: PaymentRow): string | undefined => {
  let createdAt = undefined;
  if (rowData?.created_at) {
    createdAt = new Date(rowData.created_at * 1000).toDateString();
  }
  return createdAt;
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
      showGridlines
      style={{ display: "grid", maxHeight: "100%", paddingBottom: "45px" }}
    >
      {/* <Column field="payment_id" header="ID" /> */}
      {/* <Column field="pass_id" header="Pass" /> */}
      <Column field="created_at" header="Date" body={createdAtTemplate} />
      <Column field="amount_paid" header="Paid" body={amountPaidTemplate} />
      <Column field="payment_method" header="Method" />
      <Column field="creator" header="Employee" />
    </DataTable>
  );
}
