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
        <ScrollPanel id="guest-info" style={{ display: "grid", maxHeight: "100%" }}>
          <Button
            label="Back"
            onClick={(e) => {
              e.preventDefault();
              setScreen(Screen.Dashboard);
            }}
          />
          <GuestInfo />
          </ScrollPanel>
      </Panel>
      <Panel header="Payments">
        <PaymentsTable />
      </Panel>
    </div>
  );
}
