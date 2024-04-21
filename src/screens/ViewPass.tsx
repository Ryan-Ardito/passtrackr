import { Button } from "primereact/button";

import { Screen } from "../types";
import { PassInfo } from "../components/PassInfo";
import { useAppContext } from "../App";

export function ViewPass() {
  const { setScreen, selectedPass, setSelectedPass } = useAppContext();

  return (
    <div className="wrapper">
      <div className="center-box">
        <PassInfo {...{ selectedPass, setSelectedPass }} />
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
