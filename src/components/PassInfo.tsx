import { PassData } from "../types";

interface PassInfoProps {
  selectedPass: PassData,
}

export const PassInfo: React.FC<PassInfoProps> = ({ selectedPass }) => {
  let creationTime = undefined;
  if (selectedPass?.creation_time) {
    creationTime = new Date(selectedPass.creation_time).toDateString();
  }

  return (
    <div>
      <div>pass_id: {selectedPass.pass_id}</div>
      <div>guest_id: {selectedPass.guest_id}</div>
      <div>remaining: {selectedPass.remaining_uses}</div>
      <div>passtype: {selectedPass.passtype.name}</div>
      <div>creator: {selectedPass.creator}</div>
      <div>creation_time: {creationTime}</div>
    </div>
  );
};
