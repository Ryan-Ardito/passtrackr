import { Button } from "primereact/button";

import { Screen } from "../types";
import { GuestInfo } from "../components/GuestInfo";
import { useAppContext } from "../AppContext";

export function ViewGuest() {
  const { setScreen } = useAppContext();

  return (
    <div className="viewport-wrapper">
      <div className="center-box">
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
  );
}
