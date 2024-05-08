import { useFormik } from "formik";
import * as Yup from "yup";

import { ScrollPanel } from "primereact/scrollpanel";
import { Divider } from "primereact/divider";

import { SearchPassData, SidePanel, numAddVisits, payMethods } from "../types";
import { FormikDropdown, FormikField } from "../components/FormInput";
import { addVisits } from "../api/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { showMessage } from "../utils/toast";
import { useAppContext } from "../AppContext";
import { CrudButton } from "../components/Buttons";
import { PassInfo } from "../components/PassInfo";

const validationSchema = Yup.object().shape({
  pass_id: Yup.number().required(),
  num_visits: Yup.object()
    .shape({
      name: Yup.string().required("Required"),
      code: Yup.string().required("Required"),
    })
    .required(),
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

export const AddVisits = ({ passData }: { passData: SearchPassData }) => {
  const { setSelectedPass, setPanel, toast } = useAppContext();
  const queryClient = useQueryClient();

  const { mutate: mutateAddVisits } = useMutation({
    mutationKey: ["addVisits"],
    mutationFn: addVisits,
    onError: (error) => {
      showMessage(error.name, error.message, toast, "warn");
      formik.setSubmitting(false);
    },
    onSuccess: (remaining_uses) => {
      queryClient.invalidateQueries({ queryKey: ["search"] });
      setSelectedPass({ ...passData, remaining_uses });
      showMessage("Add Visits", "Success!", toast, "success");
      setPanel(SidePanel.PassInteraction);
    },
  });

  const formik = useFormik({
    initialValues: {
      pass_id: passData.pass_id,
      num_visits: undefined,
      pay_method: undefined,
      last_four: undefined,
      amount_paid: undefined,
      signature: "",
    },
    validationSchema: validationSchema,
    onSubmit: (values) => mutateAddVisits(values),
  });

  return (
    <ScrollPanel className="flex-1">
      <form onSubmit={formik.handleSubmit} className="flex-box flex-col">
        <FormikDropdown
          label="Visits"
          name="num_visits"
          placeholder="Add Visits"
          options={numAddVisits}
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
            label="Add Visits"
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
