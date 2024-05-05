import { useState } from "react";
import { BackRevert, CrudButton } from "./Buttons";
import { ViewPassData, editPassNotes } from "../api/api";
import { Panel } from "primereact/panel";
import { GuestData } from "../types";
import { InputTextarea } from "primereact/inputtextarea";
import { useFormik } from "formik";
import {
  InvalidateQueryFilters,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { showMessage } from "../utils/toast";
import { useAppContext } from "../AppContext";
import * as Yup from "yup";

const validationSchema = Yup.object().shape({
  notes: Yup.string(),
  passId: Yup.number(),
});

interface PassDetailsProps {
  passData: ViewPassData | undefined;
  guestData: GuestData | undefined;
  prevPage: () => void;
}

export function PassDetails({
  passData,
  guestData,
  prevPage,
}: PassDetailsProps) {
  const [fieldChange, setFieldChange] = useState(false);
  const { toast } = useAppContext();
  const queryClient = useQueryClient();

  const { mutate: mutateEditPassNotes, isPending: isEditPassPending } =
    useMutation({
      mutationKey: ["editPassNotes", passData?.pass_id],
      mutationFn: editPassNotes,
      onError: (error) => {
        showMessage(error.name, error.message, toast, "warn");
        formik.setSubmitting(false);
      },
      onSuccess: () => {
        queryClient.invalidateQueries([
          "pass",
          passData?.pass_id,
        ] as InvalidateQueryFilters);
        prevPage();
        showMessage("Edit Pass", "Success!", toast, "success");
        setFieldChange(false);
        formik.setSubmitting(false);
      },
    });

  const formik = useFormik({
    initialValues: {
      notes: passData?.notes,
      passId: passData?.pass_id,
    },
    validationSchema: validationSchema,
    onSubmit: (values) => mutateEditPassNotes(values),
  });

  let createdAt = undefined;
  if (passData?.created_at) {
    createdAt = new Date(passData.created_at).toLocaleDateString();
  }

  let expiresAt = undefined;
  if (passData?.expires_at) {
    expiresAt = new Date(passData.expires_at).toLocaleDateString();
  }

  return (
    <form id="pass-details" className="flex-col" onSubmit={formik.handleSubmit}>
      <BackRevert
        {...{ fieldChange, prevPage }}
        onRevert={() => {
          formik.resetForm();
          setFieldChange(false);
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
        loading={isEditPassPending}
        disabled={!fieldChange}
      />
      <Panel>
        <div>
          {passData?.expires_at &&
            (Date.now() > passData.expires_at ? (
              <>
                <b style={{ color: "red" }}>Expired</b> {expiresAt}
              </>
            ) : (
              `Expires ${expiresAt}`
            ))}
          <div style={{ wordWrap: "break-word" }}>
            Created {createdAt} by {passData?.creator}
          </div>
        </div>
      </Panel>
      <Panel header={`Owner ${guestData?.guest_id}`}>
        <div>{`${guestData?.first_name} ${guestData?.last_name}`}</div>
        {<div>{`Town: ${guestData?.town}`}</div>}
      </Panel>
    </form>
  );
}
