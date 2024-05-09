import { useState } from "react";
import {
  BackRevert,
  CrudButton,
  DeleteButton,
  FavoriteButton,
} from "./Buttons";
import {
  ViewPassData,
  deletePass,
  editPassNotes,
  setPassFavorite,
} from "../api/api";
import { Panel } from "primereact/panel";
import { GuestData, blankPass } from "../types";
import { InputTextarea } from "primereact/inputtextarea";
import { useFormik } from "formik";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { showMessage } from "../utils/toast";
import { useAppContext } from "../AppContext";
import * as Yup from "yup";
import { ExpirationText, RemainingUsesText } from "./PassInfo";
import { TextInputButton } from "./FormInput";

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
  const { search, setSelectedPass, toast } = useAppContext();
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
        queryClient.invalidateQueries({
          queryKey: ["pass", passData?.pass_id],
        });
        prevPage();
        showMessage("Edit Pass", "Success!", toast, "success");
        setFieldChange(false);
        formik.setSubmitting(false);
      },
    });

  const { mutate: mutateSetPassFavorite, isPending: isSetPassFavoritePending } =
    useMutation({
      mutationKey: ["setPassFavorite", passData?.pass_id],
      mutationFn: setPassFavorite,
      onError: (error) => {
        showMessage(error.name, error.message, toast, "warn");
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["search"] });
        queryClient.invalidateQueries({ queryKey: ["favorites"] });
        queryClient.invalidateQueries({
          queryKey: ["pass", passData?.pass_id],
        });
        if (search.length === 0) {
          setSelectedPass(blankPass);
          prevPage();
        }
      },
    });

  const { mutate: mutateDeletePass, isPending: isDeletePassPending } =
    useMutation({
      mutationKey: ["deletePass", passData?.pass_id],
      mutationFn: deletePass,
      onError: (error) => {
        showMessage(error.name, error.message, toast, "warn");
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["search"] });
        queryClient.invalidateQueries({ queryKey: ["favorites"] });
        queryClient.invalidateQueries({
          queryKey: ["pass", passData?.pass_id],
        });
        setSelectedPass(blankPass);
        showMessage("Delete pass", "Success!", toast, "success");
        prevPage();
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

  return (
    <>
      <form
        id="pass-details"
        className="flex-col"
        onSubmit={formik.handleSubmit}
      >
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
          value={formik.values.notes || ""}
          rows={7}
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
      </form>
      <Panel>
        {passData && (
          <>
            <div>
              {passData.remaining_uses != undefined && (
                <RemainingUsesText remaining_uses={passData.remaining_uses} />
              )}
              {passData.expires_at && (
                <ExpirationText expires_at={passData.expires_at} />
              )}
            </div>
            <div style={{ wordWrap: "break-word" }}>
              Created {createdAt} by {passData?.creator}
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "auto auto",
                gap: "6px",
                width: "fit-content"
              }}
            >
              <FavoriteButton
                style={{ width: "100%" }}
                checked={passData.favorite}
                disabled={isSetPassFavoritePending}
                loading={isSetPassFavoritePending}
                onClick={() => {
                  mutateSetPassFavorite({
                    favorite: !passData.favorite,
                    passId: passData.pass_id,
                  });
                }}
              />
              <TextInputButton label="Transfer" />
            </div>
          </>
        )}
      </Panel>
      <Panel header={`Owner ${guestData?.guest_id}`}>
        <div>
          {guestData?.first_name} {guestData?.last_name}
        </div>
        {<div>{guestData?.town}</div>}
      </Panel>
      <DeleteButton
        label="Delete pass"
        severity="danger"
        icon="pi pi-delete-left"
        loading={isDeletePassPending}
        onClick={() => mutateDeletePass(passData?.pass_id)}
      />
    </>
  );
}
