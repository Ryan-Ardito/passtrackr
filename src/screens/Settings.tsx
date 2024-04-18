import { useState } from "react";
import { Button } from "primereact/button"

import { Screen } from "../types"
import { InputField } from "../components/FormInput"

interface ChildProps {
  setScreen: React.Dispatch<React.SetStateAction<Screen>>,
}

export function Settings({ setScreen }: ChildProps) {
  const [ipAddr, setIpAddr] = useState("");

  return (
    <div className="wrapper">
      <div className="container center-box">
        <InputField label="DB server IP:" value={ipAddr} onChange={setIpAddr}/>
        <Button label="Save" onClick={(e) => {
          e.preventDefault();
          setScreen(Screen.Dashboard);
        }} />
        <Button label="Back" onClick={(e) => {
          e.preventDefault();
          setScreen(Screen.Dashboard);
        }} />
      </div>
    </div>
  )
}