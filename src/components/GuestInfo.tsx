import { useAppContext } from "../AppContext";
import { useQuery } from "@tanstack/react-query";
import { getGuest } from "../api/api";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";

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
    <div id="guest-info" className="flex-box flex-col">
      <div>Guest ID: {guestData?.guest_id}</div>
      <InputText placeholder="First name" value={guestData?.first_name} />
      <InputText placeholder="Last name" value={guestData?.last_name} />
      <InputText placeholder="Town" value={guestData?.town} />
      <InputText placeholder="Email" value={guestData?.email} />
      <InputTextarea
        placeholder="Notes"
        value={guestData?.notes}
        autoResize
        style={{ maxWidth: "100%" }}
      />
      <div>creator: {guestData?.creator}</div>
      <div>Creation time: {creationTime}</div>
    </div>
  );
}
