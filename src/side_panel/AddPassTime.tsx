import { useFormik } from "formik";
import * as Yup from "yup";

import { ScrollPanel } from "primereact/scrollpanel";
import { Divider } from "primereact/divider";

import {
  SearchPassData,
  SidePanel,
  addPassTimeDropOpts,
  payMethods,
} from "../types";
import { FormikDropdown, FormikField } from "../components/FormInput";
import { addTimeToPass } from "../api/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { showMessage } from "../utils/toast";
import { useAppContext } from "../AppContext";
import { CrudButton } from "../components/Buttons";
import { PassInfo } from "../components/PassInfo";

const validationSchema = Yup.object().shape({
  pass_id: Yup.number().required(),
  num_days: Yup.object().shape({
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
  signature: Yup.string().required("Required").max(24, "Invalid"),
});

export const AddPassTime = ({ passData }: { passData: SearchPassData }) => {
  const { setSelectedPass, setPanel, toast } = useAppContext();
  const queryClient = useQueryClient();

  const { mutate: mutateAddPassTime } = useMutation({
    mutationKey: ["addPassTime"],
    mutationFn: addTimeToPass,
    onError: (error) => {
      showMessage(error.name, error.message, toast, "warn");
      formik.setSubmitting(false);
    },
    onSuccess: (expires_at) => {
      if (expires_at == undefined) {
        showMessage("Data error", "Pass has no expiration", toast, "error");
        formik.setSubmitting(false);
        return;
      }
      queryClient.invalidateQueries({ queryKey: ["search"] });
      setSelectedPass({ ...passData, expires_at });
      showMessage("Add Time", "Success!", toast, "success");
      setPanel(SidePanel.PassInteraction);
    },
  });

  const formik = useFormik({
    initialValues: {
      pass_id: passData.pass_id,
      num_days: undefined,
      pay_method: undefined,
      last_four: undefined,
      amount_paid: undefined,
      signature: "",
    },
    validationSchema: validationSchema,
    onSubmit: (values) => mutateAddPassTime(values),
  });

  return (
    <ScrollPanel className="flex-1">
      <form onSubmit={formik.handleSubmit} className="flex-box flex-col">
        <FormikDropdown
          label="Add Time"
          name="num_days"
          placeholder="Add time"
          options={addPassTimeDropOpts}
          {...{ formik }}
        />
        <FormikDropdown
          label="Payment method"
          name="pay_method"
          placeholder="Pay method"
          options={payMethods}
          {...{ formik }}
        />
        <FormikField
          label="Last four (credit only)"
          name="last_four"
          {...{ formik }}
        />
        <FormikField label="Amount paid" name="amount_paid" {...{ formik }} />
        <FormikField
          label="Employee signature"
          name="signature"
          {...{ formik }}
        />
        <Divider style={{ margin: 6 }} />
        <div style={{ display: "flex", gap: "8px" }}>
          <CrudButton
            icon="pi pi-check"
            type="submit"
            label="Add Time"
            loading={formik.isSubmitting}
          />
          <CrudButton
            icon="pi pi-times"
            severity="danger"
            label="Cancel"
            onClick={() => setPanel(SidePanel.PassInteraction)}
          />
        </div>
        <Divider style={{ margin: 6 }} />
      </form>
      {passData.pass_id && <PassInfo selectedPass={passData} />}
    </ScrollPanel>
  );
};
