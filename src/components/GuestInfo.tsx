import * as Yup from "yup";
import { useAppContext } from "../AppContext";
import {
  InvalidateQueryFilters,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { editGuest } from "../api/api";
import { InputTextarea } from "primereact/inputtextarea";
import { CrudButton } from "./Buttons";
import { showMessage } from "../utils/toast";
import { useFormik } from "formik";
import { FormikField } from "./FormInput";
import { ChangeEvent, useState } from "react";
import { GuestData } from "../types";

const validationSchema = Yup.object().shape({
  guest_id: Yup.number().required(),
  first_name: Yup.string().max(50, "Invalid").required(),
  last_name: Yup.string().max(50, "Invalid").required(),
  town: Yup.string().max(50, "Invalid"),
  email: Yup.string().max(50, "Invalid"),
  notes: Yup.string(),
});

interface GuestInfoProps {
  guestData: GuestData;
}

export function GuestInfo({ guestData }: GuestInfoProps) {
  const [fieldChange, setFieldChange] = useState(false);
  const { search, selectedPass, setSelectedPass, toast } = useAppContext();
  const queryClient = useQueryClient();

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
        setSelectedPass({
          ...selectedPass,
          first_name: formik.values.first_name,
          last_name: formik.values.last_name,
          town: formik.values.town || "",
        });
        showMessage("Edit Guest", "Success!", toast, "success");
        // setPanel(SidePanel.PassInteraction);
        setFieldChange(false);
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
    creationTime = new Date(guestData.creation_time).toLocaleDateString();
  }

  const handleFieldChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFieldChange(true);
    formik.handleChange(e);
  };

  return (
    <form id="guest-info" className="flex-col" onSubmit={formik.handleSubmit}>
      {/* <div>Guest ID: {guestData?.guest_id}</div> */}
      <FormikField
        label="First name"
        name="first_name"
        onChange={handleFieldChange}
        {...{ formik }}
      />
      <FormikField
        label="Last name"
        name="last_name"
        onChange={handleFieldChange}
        {...{ formik }}
      />
      <FormikField
        label="Town"
        name="town"
        onChange={handleFieldChange}
        {...{ formik }}
      />
      <FormikField
        label="Email"
        name="email"
        onChange={handleFieldChange}
        {...{ formik }}
      />
      <InputTextarea
        placeholder="Notes"
        name="notes"
        value={formik.values.notes}
        rows={8}
        // autoResize
        style={{ maxWidth: "100%", minWidth: "100%" }}
        onChange={(e) => {
          setFieldChange(true);
          formik.handleChange(e);
        }}
      />
      <CrudButton
        label="Save"
        icon="pi pi-save"
        type="submit"
        severity="danger"
        loading={isEditGuestPending}
        disabled={!fieldChange}
      />
      <div>
        Created {creationTime} by {guestData?.creator}
      </div>
    </form>
  );
}
