import { Panel } from "primereact/panel";
import { PassData } from "../types";

interface PassInfoProps {
  selectedPass: PassData;
}

export const PassInfo = ({ selectedPass }: PassInfoProps) => {
  let createdAt = undefined;
  if (selectedPass?.created_at) {
    createdAt = new Date(selectedPass.created_at).toLocaleDateString();
  }
  let expiresAt = undefined;
  if (selectedPass?.expires_at) {
    expiresAt = new Date(selectedPass.expires_at).toLocaleDateString();
  }

  return (
    <Panel
      header={`${selectedPass.passtype.name} Pass ${selectedPass.pass_id}`}
    >
      <div>
        {selectedPass.remaining_uses && `${selectedPass.remaining_uses}x remaining`}
        {expiresAt && `Expires ${expiresAt}`}
      </div>
      <div>Owner ID: {selectedPass.guest_id}</div>
      <div style={{ wordWrap: "break-word" }}>
        Created {createdAt} by {selectedPass.creator}
      </div>
    </Panel>
  );
};
