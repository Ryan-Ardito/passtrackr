import { useAppContext } from "../AppContext";
import { useQuery } from "@tanstack/react-query";
import { getGuest } from "../api/api";

export function GuestInfo() {
  const { selectedPass } = useAppContext();

  const { data: guestData, isFetching: isGuestFetching } = useQuery({
    queryKey: ["guest", selectedPass.guest_id],
    queryFn: () => getGuest(selectedPass.guest_id),
  });

  if (isGuestFetching) {
    return <>Loading...</>;
  }

  return (
    <>
      <div>First name: {guestData?.first_name}</div>
      <div>Last name: {guestData?.last_name}</div>
      <div>Town: {guestData?.town}</div>
      <div>Email: {guestData?.email}</div>
      <div>Notes: {guestData?.notes}</div>
      <div>creator: {guestData?.creator}</div>
      <div>Creation time: {guestData?.creation_time}</div>
    </>
  );
}
