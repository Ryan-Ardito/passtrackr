import { Button } from "primereact/button"
import { Divider } from "primereact/divider"

import { PassData, Screen } from "../types"
import { logVisit } from "../api/api"
import { useState } from "react"

interface ChildProps {
  selectedPass: PassData,
  setScreen: React.Dispatch<React.SetStateAction<Screen>>,
  setAddPass: React.Dispatch<React.SetStateAction<boolean>>,
}

export const PassInteraction = ({ selectedPass, setScreen, setAddPass }: ChildProps) => {
  const [loggingVisit, setLoggingVisit] = useState(false);

  return (
    <div className="pass-interaction">
      <Button disabled={!selectedPass.id} label="Add Visits" onClick={(e) => {
        e.preventDefault();
      }} />
      <Button disabled={!selectedPass.id} label="View Pass" onClick={(e) => {
        e.preventDefault();
        setScreen(Screen.ViewPass);
      }} />
      <Button label="New Pass" onClick={(e) => {
        e.preventDefault();
        setAddPass(true);
      }} />
      <Divider />
      <Button disabled={!selectedPass.id} label="Log Visit" loading={loggingVisit}
        onClick={async (e) => {
          e.preventDefault();
          setLoggingVisit(true);
          await logVisit();
          setLoggingVisit(false);
        }}
      />
    </div>
  )
}