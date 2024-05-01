import { Button } from "primereact/button";

import { Screen } from "../types";
import { GuestInfo } from "../components/GuestInfo";
import { useAppContext } from "../AppContext";
import { VisitsTable } from "../components/VisitsTable";

export function ViewGuest() {
  const { setScreen } = useAppContext();

  return (
    <div className="viewport-wrapper">
      <div id="view-guest-screen" className="center-box">
        <div id="edit-guest">
          <VisitsTable />
          <GuestInfo />
          <Button
            label="Back"
            onClick={(e) => {
              e.preventDefault();
              setScreen(Screen.Dashboard);
            }}
          />
        </div>
      </div>
    </div>
  );
}
