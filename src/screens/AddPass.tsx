import { useFormik } from 'formik';
import * as Yup from 'yup';

import { ScrollPanel } from "primereact/scrollpanel";
import { Button } from "primereact/button";
import { Divider } from "primereact/divider";

import { HolderData, HolderAction, passtypes, payMethods, Msg, blankHolder } from "../types"
import { FormikField, InputField, LabeledDropdown } from '../components/FormInput';

interface ChildProps {
  selectedHolder: HolderData,
  setSelectedHolder: React.Dispatch<HolderAction>,
  setAddPass: React.Dispatch<boolean>,
}

export const AddPass = ({ selectedHolder, setSelectedHolder, setAddPass }: ChildProps) => {
  const formik = useFormik({
    initialValues: {
      lastFour: '',
      amountPaid: '',
      payMethod: { name: "Credit", code: "credit" },
      signature: '',
    },
    validationSchema: Yup.object().shape({
      lastFour: Yup.number()
        .typeError('must be a number')
        .positive('must be a positive number')
        .integer('must be a whole number')
        .min(1000, 'must be a 4-digit number')
        .max(9999, 'must be a 4-digit number'),
      amountPaid: Yup.number().required('required')
        .typeError('must be a number')
        .positive('must be a positive number'),
      paymentMethod: Yup.string().required('required'),
      signature: Yup.string().required('required'),
    }),
    onSubmit: values => {
      console.log('Form submitted:', values);
      setAddPass(false);
    },
  });

  return (
    <ScrollPanel className="holder-box">
      <form onSubmit={formik.handleSubmit}>
        <InputField label="First Name:" value={selectedHolder.first_name}
          onChange={(e) => setSelectedHolder({ type: Msg.SetFirstName, data: e })}
        />

        <InputField label="Last Name:" value={selectedHolder.last_name}
          onChange={(e) => setSelectedHolder({ type: Msg.SetLastName, data: e })}
        />

        <InputField label="Town:" value={selectedHolder.town}
          onChange={(e) => setSelectedHolder({ type: Msg.SetTown, data: e })}
        />

        <LabeledDropdown label="Passtype:"
          value={selectedHolder.passtype}
          options={passtypes}
          onChange={(e) => {
            setSelectedHolder({
              type: Msg.SetPasstype,
              data: e.value,
            })
          }}
        />

        <LabeledDropdown label="Payment Method: "
          value={formik.values.payMethod}
          options={payMethods}
          onChange={(e) => {
            formik.setFieldValue('payMethod', e.value);
          }}
        />
        <div></div>

        <FormikField
          label="Last Four:"
          name="lastFour"
          touched={formik.touched.lastFour}
          value={formik.values.lastFour}
          error={formik.errors.lastFour}
          onChange={formik.handleChange}
        />

        <FormikField
          label="Amount Paid:"
          name="amountPaid"
          touched={formik.touched.amountPaid}
          value={formik.values.amountPaid}
          error={formik.errors.amountPaid}
          onChange={formik.handleChange}
        />

        <FormikField
          label="Employee Signature:"
          name="signature"
          touched={formik.touched.signature}
          value={formik.values.signature}
          error={formik.errors.signature}
          onChange={formik.handleChange}
        />

        <Divider />
        <Button style={{ marginRight: 5 }} type="submit" label="Create Pass" />
        <Button label="Cancel" onClick={() => { setSelectedHolder({ type: Msg.Replace, data: blankHolder }); setAddPass(false); }} />
      </form>
    </ScrollPanel>
  );
}