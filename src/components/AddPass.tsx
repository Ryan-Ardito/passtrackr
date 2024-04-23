import { useFormik } from "formik";
import * as Yup from "yup";

import { ScrollPanel } from "primereact/scrollpanel";
import { Button } from "primereact/button";
import { Divider } from "primereact/divider";

import { Panel, passtypes, payMethods } from "../types";
import { FormikDropdown, FormikField } from "./FormInput";
import { createPass } from "../api/api";
import { useMutation } from "@tanstack/react-query";
import { showMessage } from "../utils/toast";
import { useAppContext } from "../AppContext";

const validationSchema = Yup.object().shape({
  first_name: Yup.string().required("Required"),
  last_name: Yup.string().required("Required"),
  town: Yup.string().required("Required"),
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
  signature: Yup.string().required("Required"),
});

export const AddPass = () => {
  const { selectedPass, setPanel, toast } = useAppContext();

  const { mutate: mutateCreatePass } = useMutation({
    mutationKey: ["createPass"],
    mutationFn: createPass,
    onError: (error) => {
      showMessage(error.name, error.message, toast, "warn");
      formik.setSubmitting(false);
    },
    onSuccess: () => {
      showMessage("Create pass", "Success!", toast, "success");
      setPanel(Panel.PassInteraction);
    },
  });

  const formik = useFormik({
    initialValues: {
      guest_id: selectedPass.guest_id,
      first_name: selectedPass.first_name,
      last_name: selectedPass.last_name,
      town: selectedPass.town,
      passtype: passtypes[0],
      pay_method: { name: "Credit", code: "credit" },
      last_four: "",
      amount_paid: "",
      signature: "",
    },
    validationSchema: validationSchema,
    onSubmit: (values) => mutateCreatePass(values),
  });

  return (
    <ScrollPanel className="flex-2">
      <form onSubmit={formik.handleSubmit}>
        <FormikField label="First Name:" name="first_name" {...{ formik }} />
        <FormikField label="Last Name:" name="last_name" {...{ formik }} />
        <FormikField label="Town:" name="town" {...{ formik }} />
        <FormikDropdown
          label="Passtype:"
          name="passtype"
          options={passtypes}
          {...{ formik }}
        />
        <FormikDropdown
          label="Payment Method:"
          name="pay_method"
          options={payMethods}
          {...{ formik }}
        />
        <FormikField label="Last Four:" name="last_four" {...{ formik }} />
        <FormikField label="Amount Paid:" name="amount_paid" {...{ formik }} />
        <FormikField
          label="Employee Signature:"
          name="signature"
          {...{ formik }}
        />
        <Divider />
        <div style={{ display: "flex", gap: "8px" }}>
          <Button
            rounded
            icon="pi pi-check"
            type="submit"
            label="Create Pass"
            loading={formik.isSubmitting}
          />
          <Button
            rounded
            icon="pi pi-times"
            severity="danger"
            label="Cancel"
            onClick={() => setPanel(Panel.PassInteraction)}
          />
        </div>
      </form>
    </ScrollPanel>
  );
};
