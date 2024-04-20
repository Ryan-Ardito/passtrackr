import { Button } from "primereact/button"
import { Divider } from "primereact/divider"

import { PassData, Screen } from "../types"
import { logVisit } from "../api/api"
import { RefObject } from "react"
import { useMutation } from "@tanstack/react-query"
import { Toast } from "primereact/toast"
import { showMessage } from "../screens/Dashboard"

interface ChildProps {
  selectedPass: PassData,
  setScreen: React.Dispatch<React.SetStateAction<Screen>>,
  setAddPass: React.Dispatch<React.SetStateAction<boolean>>,
  toast: RefObject<Toast>,
}

export const PassInteraction = ({ selectedPass, setScreen, setAddPass, toast }: ChildProps) => {
  const { mutate, isPending } = useMutation({
    mutationFn: () => logVisit(),
    onError: (error) => showMessage(error.name, error.message, toast, "warn"),
  });

  return (
    <div className="pass-interaction">
      <Button label="Add Visits" disabled={!selectedPass.id}
        onClick={(e) => e.preventDefault()
        } />
      <Button label="View Pass" disabled={!selectedPass.id}
        onClick={(e) => {
          e.preventDefault();
          setScreen(Screen.ViewPass);
        }} />
      <Button label="New Pass"
        onClick={(e) => {
          e.preventDefault();
          setAddPass(true);
        }} />
      <Divider />
      <Button disabled={!selectedPass.id} label="Log Visit" loading={isPending}
        onClick={async (e) => {
          e.preventDefault();
          mutate();
        }}
      />
    </div>
  )
}