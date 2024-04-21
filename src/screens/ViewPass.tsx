import { Button } from "primereact/button";

import { Screen } from "../types";
import { PassInfo } from "../components/PassInfo";
import { useAppContext } from "../AppContext";

export function ViewPass() {
  const { setScreen } = useAppContext();

  return (
    <div className="viewport-wrapper">
      <div className="center-box">
        <PassInfo />
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
