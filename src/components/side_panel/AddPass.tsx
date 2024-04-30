import { useFormik } from "formik";
import * as Yup from "yup";

import { ScrollPanel } from "primereact/scrollpanel";
import { Divider } from "primereact/divider";

import { SidePanel, passtypes, payMethods } from "../../types";
import { FormikDropdown, FormikField } from "../FormInput";
import { createPass } from "../../api/api";
import {
  InvalidateQueryFilters,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { showMessage } from "../../utils/toast";
import { useAppContext } from "../../AppContext";
import { CrudButton } from "../Buttons";
import { ChangeEvent } from "react";
import { Panel } from "primereact/panel";

const validationSchema = Yup.object().shape({
  first_name: Yup.string().required("Required").max(50, "Invalid"),
  last_name: Yup.string().required("Required").max(50, "Invalid"),
  town: Yup.string().required("Required").max(50, "Invalid"),
  passtype: Yup.object().shape({
    name: Yup.string().required("Required"),
    code: Yup.string().required("Required"),
  }),
  pay_method: Yup.object().shape({
    name: Yup.string(),
    code: Yup.string(),
  }),
  last_four: Yup.number()
    .typeError("Invalid")
    .integer("Invalid")
    .min(1000, "Invalid")
    .max(9999, "Invalid"),
  amount_paid: Yup.number().typeError("Invalid").min(0, "Invalid"),
  signature: Yup.string().required("Required").max(50, "Invalid"),
});

export const AddPass = () => {
  const { selectedPass, setPanel, toast, search } = useAppContext();
  const queryClient = useQueryClient();

  const { mutate: mutateCreatePass } = useMutation({
    mutationKey: ["createPass"],
    mutationFn: createPass,
    onError: (error) => {
      showMessage(error.name, error.message, toast, "warn");
      formik.setSubmitting(false);
    },
    onSuccess: () => {
      queryClient.invalidateQueries([
        "search",
        search,
      ] as InvalidateQueryFilters);
      showMessage("Create pass", "Success!", toast, "success");
      setPanel(SidePanel.PassInteraction);
    },
  });

  const formik = useFormik({
    initialValues: {
      guest_id: selectedPass.guest_id,
      first_name: selectedPass.first_name,
      last_name: selectedPass.last_name,
      town: selectedPass.town,
      passtype: passtypes[0],
      pay_method: { name: "Credit", code: "Credit" },
      last_four: undefined,
      amount_paid: undefined,
      signature: "",
    },
    validationSchema: validationSchema,
    onSubmit: (values) => mutateCreatePass(values),
  });

  // invalidate guest_id if guest fields have changed
  const handleFieldChange = (e: ChangeEvent<HTMLInputElement>) => {
    const fieldName = e.target.name;
    if (["first_name", "last_name", "town"].includes(fieldName)) {
      formik.setFieldValue("guest_id", undefined);
    }
    formik.handleChange(e);
  };

  return (
    <ScrollPanel id="create-pass">
      <form onSubmit={formik.handleSubmit} className="flex-box flex-col">
        <Panel
          header={
            formik.values.guest_id
              ? `Guest ${formik.values.guest_id}`
              : "New Guest"
          }
        >
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
        </Panel>
        <Panel>
          <FormikDropdown
            label="Passtype"
            name="passtype"
            options={passtypes}
            {...{ formik }}
          />
          <FormikDropdown
            label="Payment method"
            name="pay_method"
            options={payMethods}
            {...{ formik }}
          />
          <FormikField label="Last four" name="last_four" {...{ formik }} />
          <FormikField label="Amount paid" name="amount_paid" {...{ formik }} />
          <FormikField
            label="Employee signature"
            name="signature"
            {...{ formik }}
          />
        </Panel>
        <Divider style={{ margin: 6 }} />
        <div style={{ display: "flex", gap: "8px" }}>
          <CrudButton
            icon="pi pi-check"
            type="submit"
            label="Create Pass"
            loading={formik.isSubmitting}
          />
          <CrudButton
            icon="pi pi-times"
            severity="danger"
            label="Cancel"
            onClick={() => setPanel(SidePanel.PassInteraction)}
          />
        </div>
      </form>
    </ScrollPanel>
  );
};
