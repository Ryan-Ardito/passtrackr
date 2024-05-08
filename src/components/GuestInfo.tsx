import * as Yup from "yup";
import { useAppContext } from "../AppContext";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { editGuest } from "../api/api";
import { InputTextarea } from "primereact/inputtextarea";
import { BackRevert, CrudButton } from "./Buttons";
import { showMessage } from "../utils/toast";
import { useFormik } from "formik";
import { FormikField } from "./FormInput";
import { ChangeEvent, useState } from "react";
import { GuestData } from "../types";

const validationSchema = Yup.object().shape({
  guest_id: Yup.number().required(),
  first_name: Yup.string().max(50, "Invalid").required(),
  last_name: Yup.string().max(50, "Invalid").required(),
  town: Yup.string().max(24, "Invalid"),
  email: Yup.string().email("Invalid").max(50, "Invalid"),
  notes: Yup.string(),
});

interface GuestInfoProps {
  guestData: GuestData | undefined;
  prevPage: () => void;
}

export function GuestInfo({ guestData, prevPage }: GuestInfoProps) {
  const [fieldChange, setFieldChange] = useState(false);
  const { selectedPass, setSelectedPass, toast } = useAppContext();
  const queryClient = useQueryClient();

  const { mutate: mutateEditGuest, isPending: isEditGuestPending } =
    useMutation({
      mutationKey: ["editGuest", guestData?.guest_id],
      mutationFn: editGuest,
      onError: (error) => {
        showMessage(error.name, error.message, toast, "warn");
        formik.setSubmitting(false);
      },
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ["guest", selectedPass.guest_id],
        });
        queryClient.invalidateQueries({ queryKey: ["search"] });
        setSelectedPass({
          ...selectedPass,
          first_name: formik.values.first_name,
          last_name: formik.values.last_name,
          town: formik.values.town || "",
        });
        prevPage();
        showMessage("Edit Guest", "Success!", toast, "success");
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

  let createdAt = undefined;
  if (guestData?.created_at) {
    createdAt = new Date(guestData.created_at).toLocaleDateString();
  }

  const handleFieldChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFieldChange(true);
    formik.handleChange(e);
  };

  return (
    <form id="guest-info" className="flex-col" onSubmit={formik.handleSubmit}>
      <BackRevert
        {...{ fieldChange, prevPage }}
        onRevert={() => {
          formik.resetForm();
          setFieldChange(false);
        }}
      />
      <FormikField
        label="First name"
        name="first_name"
        onChange={handleFieldChange}
        {...{ formik }}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
          }
        }}
      />
      <FormikField
        label="Last name"
        name="last_name"
        onChange={handleFieldChange}
        {...{ formik }}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
          }
        }}
      />
      <FormikField
        label="Town"
        name="town"
        onChange={handleFieldChange}
        {...{ formik }}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
          }
        }}
      />
      <FormikField
        label="Email"
        name="email"
        onChange={handleFieldChange}
        {...{ formik }}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
          }
        }}
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
      <div style={{ wordWrap: "break-word" }}>
        Created {createdAt} by {guestData?.creator}
      </div>
    </form>
  );
}
