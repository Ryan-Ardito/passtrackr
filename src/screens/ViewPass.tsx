import { useAppContext } from "../AppContext";
import { VisitsTable } from "../components/VisitsTable";
import { PaymentsTable } from "../components/PaymentsTable";
import { Panel } from "primereact/panel";
import { ScrollPanel } from "primereact/scrollpanel";
import { useQuery } from "@tanstack/react-query";
import {
  getPass,
  getPaymentsFromPassId,
  getVisitsFromPassId,
} from "../api/api";
import { useEffect } from "react";
import { showMessage } from "../utils/toast";
import { PassDetails } from "../components/PassDetails";

export function ViewPass({ prevPage }: { prevPage: () => void }) {
  const { selectedPass, toast } = useAppContext();

  const {
    data: passData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["pass", selectedPass.pass_id],
    queryFn: () => getPass(selectedPass.pass_id),
  });

  const { data: visits } = useQuery({
    queryKey: ["visitsPassId", selectedPass.pass_id],
    queryFn: () => getVisitsFromPassId(selectedPass.pass_id),
  });

  const { data: payments } = useQuery({
    queryKey: ["paymentsPassId", selectedPass.pass_id],
    queryFn: () => getPaymentsFromPassId(selectedPass.pass_id),
  });

  useEffect(() => {
    error && showMessage(error.name, error.message, toast, "warn");
  }, [error]);

  return (
    <div id="view-guest-screen">
      <div className="flex-col" style={{ paddingBottom: "12px" }}>
        <h3>Visits</h3>
        <VisitsTable {...{ visits }} />
      </div>
      <Panel
        header={`${passData?.passtype.name} Pass ${
          isLoading
            ? "loading..."
            : error
            ? "error"
            : passData && passData.pass_id
        }`}
      >
        <ScrollPanel style={{ display: "grid" }}>
          <div
            id="pass-info"
            className="flex-col"
            style={{ paddingBottom: "40px" }}
          >
            <PassDetails {...{ passData, prevPage }} />
          </div>
        </ScrollPanel>
      </Panel>
      <div className="flex-col" style={{ paddingBottom: "12px" }}>
        <h3>Payments</h3>
        <PaymentsTable {...{ payments }} />
      </div>
    </div>
  );
}
