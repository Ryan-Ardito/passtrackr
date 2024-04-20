import { Button } from "primereact/button";

import { Screen, PassData, PassAction } from "../types";
import { PassInfo } from "../components/PassInfo";

interface ChildProps {
  setScreen: React.Dispatch<React.SetStateAction<Screen>>;
  selectedPass: PassData;
  setSelectedPass: React.Dispatch<PassAction>;
}

export function ViewPass({
  setScreen,
  selectedPass,
  setSelectedPass,
}: ChildProps) {
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
