import { Screen } from "../types";
import { GuestInfo } from "../components/GuestInfo";
import { useAppContext } from "../AppContext";
import { VisitsTable } from "../components/VisitsTable";
import { PaymentsTable } from "../components/PaymentsTable";
import { Panel } from "primereact/panel";
import { ScrollPanel } from "primereact/scrollpanel";
import { CrudButton } from "../components/Buttons";

export function ViewGuest() {
  const { setScreen, selectedPass } = useAppContext();

  return (
    <div id="view-guest-screen">
      <Panel header="Visits">
        <VisitsTable />
      </Panel>
      <Panel header={`Guest ${selectedPass.guest_id}`}>
        <ScrollPanel style={{ display: "grid", maxHeight: "100%" }}>
          <div
            id="guest-info"
            className="flex-col"
            style={{
              marginBottom: "20px",
              paddingBottom: "20px",
            }}
          >
            <CrudButton
              label="Back"
              icon="pi pi-arrow-left"
              onClick={(e) => {
                e.preventDefault();
                setScreen(Screen.Dashboard);
              }}
            />
            <GuestInfo />
          </div>
        </ScrollPanel>
      </Panel>
      <Panel header="Payments">
        <PaymentsTable />
      </Panel>
    </div>
  );
}
