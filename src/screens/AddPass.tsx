import { useFormik } from "formik";
import * as Yup from "yup";

import { ScrollPanel } from "primereact/scrollpanel";
import { Button } from "primereact/button";
import { Divider } from "primereact/divider";

import { PassData, passtypes, payMethods } from "../types";
import { FormikDropdown, FormikField } from "../components/FormInput";
import { createPass } from "../api/api";
import { useMutation } from "@tanstack/react-query";
import { showMessage } from "../utils/toast";
import { RefObject } from "react";
import { Toast } from "primereact/toast";

const validationSchema = Yup.object().shape({
  first_name: Yup.string().required("required"),
  last_name: Yup.string().required("required"),
  town: Yup.string().required("required"),
  passtype: Yup.object().shape({
    name: Yup.string().required("required"),
    code: Yup.string().required("required"),
  }),
  pay_method: Yup.object().shape({
    name: Yup.string().required("required"),
    code: Yup.string().required("required"),
  }),
  last_four: Yup.number()
    .typeError("must be a number")
    .integer("must be a whole number")
    .min(1000, "must be a 4-digit number")
    .max(9999, "must be a 4-digit number"),
  amount_paid: Yup.number()
    .typeError("must be a number")
    .min(0, "must be a positive number"),
  signature: Yup.string().required("required"),
});

interface ChildProps {
  selectedPass: PassData;
  setAddPass: React.Dispatch<boolean>;
  toast: RefObject<Toast>;
}

export const AddPass = ({ selectedPass, setAddPass, toast }: ChildProps) => {
  const { mutate: mutateCreatePass } = useMutation({
    mutationKey: ["createPass"],
    mutationFn: createPass,
    onError: (error) => {
      showMessage(error.name, error.message, toast, "warn");
      formik.setSubmitting(false);
    },
    onSuccess: () => {
      showMessage("Create pass", "success", toast, "success");
      setAddPass(false);
      formik.setSubmitting(false);
    },
  });

  const formik = useFormik({
    initialValues: {
      guest_id: selectedPass.guest_id,
      first_name: selectedPass.first_name,
      last_name: selectedPass.last_name,
      town: selectedPass.town,
      passtype: selectedPass.passtype,
      pay_method: { name: "Credit", code: "credit" },
      last_four: "",
      amount_paid: "",
      signature: "",
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      // console.log("Submitting...");
      mutateCreatePass(values);
      // console.log("Form submitted:", values);
      // setAddPass(false);
    },
  });

  return (
    <ScrollPanel className="pass-box">
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
        <FormikField label="Last Four:" name="lastFour" {...{ formik }} />
        <FormikField label="Amount Paid:" name="amount_paid" {...{ formik }} />
        <FormikField
          label="Employee Signature:"
          name="signature"
          {...{ formik }}
        />
        <Divider />
        <Button
          icon="pi pi-check"
          style={{ marginRight: 6, width: "170px" }}
          type="submit"
          label="Create Pass"
          loading={formik.isSubmitting}
        />
        <Button
          icon="pi pi-times"
          severity="danger"
          label="Cancel"
          onClick={() => setAddPass(false)}
        />
      </form>
    </ScrollPanel>
  );
};
