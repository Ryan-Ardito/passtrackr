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
  let expiresAt = "never";
  if (selectedPass?.expires_at) {
    expiresAt = new Date(selectedPass.expires_at).toLocaleDateString();
  }

  return (
    <Panel header={`Pass ${selectedPass.pass_id}`}>
      <div>{selectedPass.passtype.name}</div>
      <div>Expires {expiresAt}</div>
      <div>Uses: {selectedPass.remaining_uses || "unlimited"}</div>
      <div>Owner ID: {selectedPass.guest_id}</div>
      <div>
        Created {createdAt} by {selectedPass.creator}
      </div>
    </Panel>
  );
};
