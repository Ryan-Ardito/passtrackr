import { Button } from "primereact/button"
import { Divider } from "primereact/divider"

import { HolderData } from "../App"
import { Screen } from "../App"

interface ChildProps {
  selectedHolder: HolderData,
  setScreen: React.Dispatch<React.SetStateAction<Screen>>,
  setAddPass: React.Dispatch<React.SetStateAction<boolean>>,
}

export const PassInteraction = ({ selectedHolder, setScreen, setAddPass }: ChildProps) => {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "5px", flex: 1 }}>
      <Button disabled={!selectedHolder.id} label="Log Visit" onClick={(e) => {
        e.preventDefault();
      }} />
      <Button disabled={!selectedHolder.id} label="Add Visits" onClick={(e) => {
        e.preventDefault();
      }} />
      <Button disabled={!selectedHolder.id} label="View Pass" onClick={(e) => {
        e.preventDefault();
        setScreen(Screen.ViewPass);
      }} />
      <Divider />
      <Button label="New Pass" onClick={(e) => {
        e.preventDefault();
        setAddPass(true);
      }} />
    </div>
  )
}