import { PassData } from "../types";

interface PassInfoProps {
  selectedPass: PassData,
}

export const PassInfo: React.FC<PassInfoProps> = ({ selectedPass }) => {
  return (
    <div>
      <div>pass_id: {selectedPass.pass_id}</div>
      <div>guest_id: {selectedPass.guest_id}</div>
      <div>first_name: {selectedPass.first_name}</div>
      <div>last_name: {selectedPass.last_name}</div>
      <div>town: {selectedPass.town}</div>
      <div>remaining: {selectedPass.remaining_uses}</div>
      <div>passtype: {selectedPass.passtype.name}</div>
      <div>active: {selectedPass.active ? "yes" : "no"}</div>
      <div>creator: {selectedPass.creator}</div>
      <div>creation_time: {selectedPass.creation_time}</div>
    </div>
  );
};
