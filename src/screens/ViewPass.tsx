import { Button } from "primereact/button"

import { Screen, HolderData, HolderAction } from "../types"
import { PassInfo } from "../components/PassInfo";

interface ChildProps {
  setScreen: React.Dispatch<React.SetStateAction<Screen>>,
  selectedHolder: HolderData,
  setSelectedHolder: React.Dispatch<HolderAction>,
}

export function ViewPass({ setScreen, selectedHolder, setSelectedHolder }: ChildProps) {
  return (
    <div className="wrapper">
      <div className="container" style={{ width: '400px', margin: '0 auto' }}>
        <PassInfo selectedHolder={selectedHolder} setSelectedHolder={setSelectedHolder} />
        <Button label="Back" onClick={(e) => {
          e.preventDefault();
          setScreen(Screen.Dashboard);
        }} />
      </div>
    </div>
  )
}