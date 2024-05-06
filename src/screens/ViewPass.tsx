import { useAppContext } from "../AppContext";
import { VisitsTable } from "../components/VisitsTable";
import { PaymentsTable } from "../components/PaymentsTable";
import { Panel } from "primereact/panel";
import { ScrollPanel } from "primereact/scrollpanel";
import { useQuery } from "@tanstack/react-query";
import {
  getGuest,
  getPass,
  getPaymentsFromPassId,
  getVisitsFromPassId,
} from "../api/api";
import { useEffect } from "react";
import { showMessage } from "../utils/toast";
import { PassDetails } from "../components/PassDetails";
import { EditPassTemplate } from "../components/EditPassTemplate";

export function ViewPass({ prevPage }: { prevPage: () => void }) {
  const { selectedPass, toast } = useAppContext();

  const {
    data: passData,
    isLoading: isPassLoading,
    error,
  } = useQuery({
    queryKey: ["pass", selectedPass.pass_id],
    queryFn: () => getPass(selectedPass.pass_id),
  });

  const { data: guestData, isLoading: isGuestLoading } = useQuery({
    queryKey: ["guest", passData?.guest_id],
    queryFn: () => getGuest(passData?.guest_id),
  });

  const { data: visits } = useQuery({
    queryKey: ["visitsPassId", passData?.pass_id],
    queryFn: () => getVisitsFromPassId(passData?.pass_id),
  });

  const { data: payments } = useQuery({
    queryKey: ["paymentsPassId", passData?.pass_id],
    queryFn: () => getPaymentsFromPassId(passData?.pass_id),
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
        header={
          <>
            {passData?.passtype.name || ""} Pass{" "}
            {isPassLoading
              ? "loading..."
              : error
              ? "fetch failed"
              : passData && passData.pass_id}
          </>
        }
      >
        <ScrollPanel style={{ display: "grid" }}>
          <div
            id="pass-info"
            className="flex-col"
            style={{ paddingBottom: "40px" }}
          >
            {passData && guestData ? (
              <PassDetails {...{ passData, guestData, prevPage }} />
            ) : (
              <EditPassTemplate
                {...{ isPassLoading, isGuestLoading, prevPage }}
              />
            )}
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
