import { PassData } from "../types";

interface PassInfoProps {
  selectedPass: PassData,
}

export const PassInfo: React.FC<PassInfoProps> = ({ selectedPass }) => {
  let createdAt = undefined;
  if (selectedPass?.created_at) {
    createdAt = new Date(selectedPass.created_at).toDateString();
  }
  let expiresAt = "Never";
  if (selectedPass?.expires_at) {
    expiresAt = new Date(selectedPass.expires_at).toDateString();
  }

  return (
    <div>
      <div>Pass ID: {selectedPass.pass_id}</div>
      <div>Guest ID: {selectedPass.guest_id}</div>
      <div>Remaining: {selectedPass.remaining_uses}</div>
      <div>Passtype: {selectedPass.passtype.name}</div>
      <div>Creator: {selectedPass.creator}</div>
      <div>Expires: {expiresAt}</div>
      <div>Created: {createdAt}</div>
    </div>
  );
};
