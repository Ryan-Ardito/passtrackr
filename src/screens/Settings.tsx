import { useState } from "react";
import { Button } from "primereact/button";

import { Screen } from "../types";
import { InputField } from "../components/FormInput";
import { asyncSleep } from "../api/api";
import { useAppContext } from "../AppContext";

export function Settings() {
  const { setScreen } = useAppContext();

  const [ipAddr, setIpAddr] = useState("");
  const [dbPass, setDbPass] = useState("");
  const [saving, setSaving] = useState(false);

  return (
    <div className="wrapper">
      <div className="container center-box">
        <InputField
          label="Database server IP:"
          value={ipAddr}
          onChange={setIpAddr}
        />
        <InputField
          label="Database password:"
          value={dbPass}
          onChange={setDbPass}
        />
        <Button
          label="Save"
          loading={saving}
          onClick={async (e) => {
            e.preventDefault();
            setSaving(true);
            await asyncSleep(800);
            setSaving(false);
            setScreen(Screen.Dashboard);
          }}
        />
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
