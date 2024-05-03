import { PassData } from "../types";

interface PassInfoProps {
  selectedPass: PassData,
}

export const PassInfo: React.FC<PassInfoProps> = ({ selectedPass }) => {
  let creationTime = undefined;
  if (selectedPass?.created_at) {
    creationTime = new Date(selectedPass.created_at).toDateString();
  }

  return (
    <div>
      <div>pass_id: {selectedPass.pass_id}</div>
      <div>guest_id: {selectedPass.guest_id}</div>
      <div>remaining: {selectedPass.remaining_uses}</div>
      <div>passtype: {selectedPass.passtype.name}</div>
      <div>creator: {selectedPass.creator}</div>
      <div>created_at: {creationTime}</div>
    </div>
  );
};
