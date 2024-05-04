import { GuestInfo } from "../components/GuestInfo";
import { useAppContext } from "../AppContext";
import { VisitsTable } from "../components/VisitsTable";
import { PaymentsTable } from "../components/PaymentsTable";
import { Panel } from "primereact/panel";
import { ScrollPanel } from "primereact/scrollpanel";
import { useQuery } from "@tanstack/react-query";
import { getGuest } from "../api/api";
import { EditGuestTemplate } from "../components/EditGuestTemplate";

export function ViewGuest() {
  const { selectedPass } = useAppContext();

  const { data: guestData } = useQuery({
    queryKey: ["guest", selectedPass.guest_id],
    queryFn: () => getGuest(selectedPass.guest_id),
  });

  return (
    <div id="view-guest-screen">
      <div className="flex-col" style={{ paddingBottom: "12px" }}>
        <h3>Visits</h3>
        <VisitsTable />
      </div>
      <Panel header={`Guest ${selectedPass.guest_id}`}>
        <ScrollPanel style={{ display: "grid" }}>
          <div
            id="guest-info"
            className="flex-col"
            style={{ paddingBottom: "40px" }}
          >
            {guestData ? (
              <GuestInfo guestData={guestData} />
            ) : (
              // <h3>Loading...</h3>
              <EditGuestTemplate />
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
