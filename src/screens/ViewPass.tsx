import { Button } from "primereact/button"

import { Screen, HolderData, HolderAction } from "../App"
import { PassInfo } from "../components/PassInfo";

interface ChildProps {
  setScreen: React.Dispatch<React.SetStateAction<Screen>>,
  selectedHolder: HolderData,
  setSelectedHolder: React.Dispatch<HolderAction>,
}

export function ViewPass({ setScreen, selectedHolder, setSelectedHolder }: ChildProps) {
  return (
    <div className="wrapper">
      <div className="container">
        <PassInfo selectedHolder={selectedHolder} setSelectedHolder={setSelectedHolder} />
        <Button label="Back" onClick={(e) => {
          e.preventDefault();
          setScreen(Screen.Dashboard);
        }} />
      </div>
    </div>
  )
}