import { Button } from "primereact/button";

import { Screen } from "../types";
import { GuestInfo } from "../components/GuestInfo";
import { useAppContext } from "../AppContext";
import { VisitsTable } from "../components/VisitsTable";
import { PaymentsTable } from "../components/PaymentsTable";

export function ViewGuest() {
  const { setScreen } = useAppContext();

  return (
    <div id="view-guest-screen">
      <VisitsTable />
      <div id="edit-guest">
        <GuestInfo />
        <Button
          label="Back"
          onClick={(e) => {
            e.preventDefault();
            setScreen(Screen.Dashboard);
          }}
        />
      </div>
      <PaymentsTable />
    </div>
  );
}
