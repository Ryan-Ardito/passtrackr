import { useAppContext } from "../AppContext";
import { useQuery } from "@tanstack/react-query";
import { getGuest } from "../api/api";

export function GuestInfo() {
  const { selectedPass } = useAppContext();

  const { data: guestData, isFetching: isGuestFetching } = useQuery({
    queryKey: ["guest", selectedPass.guest_id],
    queryFn: () => getGuest(selectedPass.guest_id),
  });

  let creationTime = undefined;
  if (guestData?.creation_time) {
    creationTime = new Date(guestData.creation_time).toDateString();
  }

  if (isGuestFetching) {
    return <>Loading...</>;
  }

  return (
    <div id="guest-info">
      <div>Guest ID: {guestData?.guest_id}</div>
      <div>First name: {guestData?.first_name}</div>
      <div>Last name: {guestData?.last_name}</div>
      <div>Town: {guestData?.town}</div>
      <div>Email: {guestData?.email}</div>
      <div>Notes: {guestData?.notes}</div>
      <div>creator: {guestData?.creator}</div>
      <div>Creation time: {creationTime}</div>
    </div>
  );
}
