import { GuestInfo } from "../components/GuestInfo";
import { useAppContext } from "../AppContext";
import { VisitsTable } from "../components/VisitsTable";
import { PaymentsTable } from "../components/PaymentsTable";
import { Panel } from "primereact/panel";
import { ScrollPanel } from "primereact/scrollpanel";
import { useQuery } from "@tanstack/react-query";
import { getGuest } from "../api/api";
import { EditGuestTemplate } from "../components/EditGuestTemplate";
import { useEffect } from "react";
import { showMessage } from "../utils/toast";

export function ViewGuest({ prevPage }: { prevPage: () => void }) {
  const { selectedPass, toast } = useAppContext();

  const {
    data: guestData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["guest", selectedPass.guest_id],
    queryFn: () => getGuest(selectedPass.guest_id),
  });

  useEffect(() => {
    error && showMessage(error.name, error.message, toast, "warn");
  }, [error]);

  return (
    <div id="view-guest-screen">
      <div className="flex-col" style={{ paddingBottom: "12px" }}>
        <h3>Visits</h3>
        <VisitsTable />
      </div>
      <Panel
        header={`Guest ${
          isLoading
            ? "loading..."
            : error
            ? "error"
            : guestData && guestData.guest_id
        }`}
      >
        <ScrollPanel style={{ display: "grid" }}>
          <div
            id="guest-info"
            className="flex-col"
            style={{ paddingBottom: "40px" }}
          >
            {isLoading || !guestData ? (
              <EditGuestTemplate />
            ) : (
              <GuestInfo {...{ guestData, prevPage }} />
            )}
          </div>
        </ScrollPanel>
      </Panel>
      <div className="flex-col" style={{ paddingBottom: "12px" }}>
        <h3>Payments</h3>
        <PaymentsTable />
      </div>
    </div>
  );
}
