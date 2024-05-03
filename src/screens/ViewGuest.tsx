import { Screen } from "../types";
import { GuestInfo } from "../components/GuestInfo";
import { useAppContext } from "../AppContext";
import { VisitsTable } from "../components/VisitsTable";
import { PaymentsTable } from "../components/PaymentsTable";
import { Panel } from "primereact/panel";
import { ScrollPanel } from "primereact/scrollpanel";
import { CrudButton } from "../components/Buttons";

export function ViewGuest() {
  const { setScreen, guestData } = useAppContext();

  return (
    <div id="view-guest-screen">
      <Panel header="Visits">
        <VisitsTable />
      </Panel>
      <Panel header={`Guest ${guestData?.guest_id}`}>
        <ScrollPanel style={{ display: "grid", width: "90%" }}>
          <div
            id="guest-info"
            className="flex-col"
            style={{ paddingBottom: "40px" }}
          >
            <CrudButton
              label="Back"
              icon="pi pi-arrow-left"
              onClick={(e) => {
                e.preventDefault();
                setScreen(Screen.Dashboard);
              }}
            />
            {guestData && <GuestInfo guestData={guestData} />}
          </div>
        </ScrollPanel>
      </Panel>
      <Panel header="Payments">
        <PaymentsTable />
      </Panel>
    </div>
  );
}
