import * as Yup from "yup";
import { useAppContext } from "../AppContext";
import {
  InvalidateQueryFilters,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { editGuest, getGuest } from "../api/api";
import { InputTextarea } from "primereact/inputtextarea";
import { CrudButton } from "./Buttons";
import { showMessage } from "../utils/toast";
import { useFormik } from "formik";
import { FormikField } from "./FormInput";

const validationSchema = Yup.object().shape({
  guest_id: Yup.number().required(),
  first_name: Yup.string().max(50, "Invalid").required(),
  last_name: Yup.string().max(50, "Invalid").required(),
  town: Yup.string().max(50, "Invalid"),
  email: Yup.string().email("Invalid").max(50, "Invalid"),
  notes: Yup.string(),
});

export function GuestInfo() {
  const { search, selectedPass, toast } = useAppContext();
  const queryClient = useQueryClient();

  const { data: guestData } = useQuery({
    queryKey: ["guest", selectedPass.guest_id],
    queryFn: () => getGuest(selectedPass.guest_id),
  });

  const { mutate: mutateEditGuest, isPending: isEditGuestPending } =
    useMutation({
      mutationKey: ["editGuest"],
      mutationFn: editGuest,
      onError: (error) => {
        showMessage(error.name, error.message, toast, "warn");
        formik.setSubmitting(false);
      },
      onSuccess: () => {
        queryClient.invalidateQueries([
          "search",
          search,
        ] as InvalidateQueryFilters);
        // setSelectedPass({
        //   ...selectedPass,
        //   remaining_uses,
        // });
        showMessage("Edit Guest", "Success!", toast, "success");
        // setPanel(SidePanel.PassInteraction);
        formik.setSubmitting(false);
      },
    });

  const formik = useFormik({
    initialValues: {
      guest_id: guestData?.guest_id || 0,
      first_name: guestData?.first_name || "",
      last_name: guestData?.last_name || "",
      town: guestData?.town,
      email: guestData?.email,
      notes: guestData?.notes,
    },
    validationSchema: validationSchema,
    onSubmit: (values) => mutateEditGuest(values),
  });

  let creationTime = undefined;
  if (guestData?.creation_time) {
    creationTime = new Date(guestData.creation_time).toDateString();
  }

  if (isEditGuestPending) {
    return <>Loading...</>;
  }

  return (
    <form id="guest-info" className="flex-col" onSubmit={formik.handleSubmit}>
      {/* <div>Guest ID: {guestData?.guest_id}</div> */}
      <FormikField
        label="First name"
        name="first_name"
        onChange={formik.handleChange}
        {...{ formik }}
      />
      <FormikField
        label="Last name"
        name="last_name"
        onChange={formik.handleChange}
        {...{ formik }}
      />
      <FormikField
        label="Town"
        name="town"
        onChange={formik.handleChange}
        {...{ formik }}
      />
      <FormikField
        label="Email"
        name="email"
        onChange={formik.handleChange}
        {...{ formik }}
      />
      <InputTextarea
        placeholder="Notes"
        name="notes"
        value={formik.values.notes}
        autoResize
        style={{ maxWidth: "100%" }}
        onChange={formik.handleChange}
      />
      <CrudButton label="Save" icon="pi pi-save" type="submit" />
      <div>Creator: {guestData?.creator}</div>
      <div>Created: {creationTime}</div>
    </form>
  );
}
