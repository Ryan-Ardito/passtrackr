import { Button } from "primereact/button";

import { Screen } from "../types";
import { useAppContext } from "../AppContext";

export function About() {
  const { setScreen } = useAppContext();

  return (
    <div className="wrapper">
      <div className="container center-box">
        <div>Passtracker is a tracker for passes.</div>
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
