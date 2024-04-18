import { Button } from "primereact/button"

import { Screen } from "../types"

interface ChildProps {
  setScreen: React.Dispatch<React.SetStateAction<Screen>>,
}

export function Settings({ setScreen }: ChildProps) {
  return (
    <div className="wrapper">
      <div className="container">
        <Button label="Back" onClick={(e) => {
          e.preventDefault();
          setScreen(Screen.Dashboard);
        }} />
      </div>
    </div>
  )
}