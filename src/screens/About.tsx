import { Button } from "primereact/button"

import { Screen } from "../types"

interface ChildProps {
  setScreen: React.Dispatch<React.SetStateAction<Screen>>,
}

export function About({ setScreen }: ChildProps) {
  return (
    <div className="wrapper">
      <div className="container center-box">
        <div>Passtracker is a tracker for passes.</div>
        <Button label="Back" onClick={(e) => {
          e.preventDefault();
          setScreen(Screen.Dashboard);
        }} />
      </div>
    </div>
  )
}