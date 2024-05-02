import { Button } from "primereact/button";

import { Screen } from "../types";
import { GuestInfo } from "../components/GuestInfo";
import { useAppContext } from "../AppContext";
import { VisitsTable } from "../components/VisitsTable";
import { PaymentsTable } from "../components/PaymentsTable";
import { Panel } from "primereact/panel";
import { ScrollPanel } from "primereact/scrollpanel";

export function ViewGuest() {
  const { setScreen } = useAppContext();

  return (
    <div id="view-guest-screen">
      <Panel header="Visits">
        <VisitsTable />
      </Panel>
      <Panel header="Guest">
        <ScrollPanel style={{ display: "grid", maxHeight: "100%" }}>
          <div
            id="guest-info"
            style={{
              marginBottom: "20px",
              paddingBottom: "20px",
            }}
          >
            <Button
              label="Back"
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
