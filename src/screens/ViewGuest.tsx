import { Screen } from "../types";
import { GuestInfo } from "../components/GuestInfo";
import { useAppContext } from "../AppContext";
import { VisitsTable } from "../components/VisitsTable";
import { PaymentsTable } from "../components/PaymentsTable";
import { Panel } from "primereact/panel";
import { ScrollPanel } from "primereact/scrollpanel";
import { CrudButton } from "../components/Buttons";
import { useQuery } from "@tanstack/react-query";
import { getGuest } from "../api/api";

export function ViewGuest() {
  const { setScreen, selectedPass } = useAppContext();

  const { data: guestData } = useQuery({
    queryKey: ["guest", selectedPass.guest_id],
    queryFn: () => getGuest(selectedPass.guest_id),
  });

  return (
    <div id="view-guest-screen">
      <Panel header="Visits">
        <VisitsTable />
      </Panel>
      <Panel header={`Guest ${guestData?.guest_id}`}>
        <ScrollPanel style={{ display: "grid", maxHeight: "100%" }}>
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
