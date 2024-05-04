import { GuestInfo } from "../components/GuestInfo";
import { useAppContext } from "../AppContext";
import { VisitsTable } from "../components/VisitsTable";
import { PaymentsTable } from "../components/PaymentsTable";
import { Panel } from "primereact/panel";
import { ScrollPanel } from "primereact/scrollpanel";

export function ViewGuest() {
  const { guestData } = useAppContext();

  return (
    <div id="view-guest-screen">
      <div className="flex-col" style={{ paddingBottom: "12px" }}>
        <h3>Visits</h3>
        <VisitsTable />
      </div>
      <Panel header={`Guest ${guestData?.guest_id}`}>
        {/* <h3>{`Guest ${guestData?.guest_id}`}</h3> */}
        <ScrollPanel style={{ display: "grid" }}>
          <div
            id="guest-info"
            className="flex-col"
            style={{ paddingBottom: "40px" }}
          >
            {guestData && <GuestInfo guestData={guestData} />}
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
