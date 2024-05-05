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
      <div
        style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "6px" }}
      >
        <CrudButton
          label="Back"
          icon="pi pi-arrow-left"
          onClick={(e) => {
            e.preventDefault();
            prevPage();
          }}
        />
        <CrudButton
          label="Revert"
          icon="pi pi-undo"
          severity="warning"
          disabled={!fieldChange}
          onClick={(e) => {
            e.preventDefault();
            formik.resetForm();
            setFieldChange(false);
          }}
        />
      </div>
      <FormikField
        label="First name"
        name="first_name"
        onChange={handleFieldChange}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
          }
        }}
        {...{ formik }}
      />
      <FormikField
        label="Last name"
        name="last_name"
        onChange={handleFieldChange}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
          }
        }}
        {...{ formik }}
      />
      <FormikField
        label="Town"
        name="town"
        onChange={handleFieldChange}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
          }
        }}
        {...{ formik }}
      />
      <FormikField
        label="Email"
        name="email"
        onChange={handleFieldChange}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
          }
        }}
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
      <div style={{ wordWrap: "break-word" }}>
        Created {createdAt} by {guestData?.creator}
      </div>
    </form>
  );
}
