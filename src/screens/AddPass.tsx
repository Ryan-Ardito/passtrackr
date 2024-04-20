import { useFormik } from 'formik';
import * as Yup from 'yup';

import { ScrollPanel } from "primereact/scrollpanel";
import { Button } from "primereact/button";
import { Divider } from "primereact/divider";

import { PassData, passtypes, payMethods } from "../types"
import { FormikDropdown, FormikField } from '../components/FormInput';
import { asyncSleep } from '../api/api';

const validationSchema = Yup.object().shape({
  firstName: Yup.string().required("required"),
  lastName: Yup.string().required("required"),
  town: Yup.string().required("required"),
  passtype: Yup.object().shape({
    name: Yup.string().required('required'),
    code: Yup.string().required('required'),
  }),
  payMethod: Yup.object().shape({
    name: Yup.string().required('required'),
    code: Yup.string().required('required'),
  }),
  lastFour: Yup.number()
    .typeError('must be a number')
    .positive('must be a positive number')
    .integer('must be a whole number')
    .min(1000, 'must be a 4-digit number')
    .max(9999, 'must be a 4-digit number'),
  amountPaid: Yup.number().required('required')
    .typeError('must be a number')
    .positive('must be a positive number'),
  signature: Yup.string().required('required'),
});

interface ChildProps {
  selectedPass: PassData,
  setAddPass: React.Dispatch<boolean>,
}

export const AddPass = ({ selectedPass, setAddPass }: ChildProps) => {
  const formik = useFormik({
    initialValues: {
      firstName: selectedPass.first_name,
      lastName: selectedPass.last_name,
      town: selectedPass.town,
      passtype: selectedPass.passtype,
      payMethod: { name: "Credit", code: "credit" },
      lastFour: '',
      amountPaid: '',
      signature: '',
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      console.log('Submitting...');
      await asyncSleep(800);
      console.log('Form submitted:', values);
      formik.setSubmitting(false);
      // setAddPass(false);
    },
  });

  return (
    <ScrollPanel className="pass-box">
      <form onSubmit={formik.handleSubmit}>
        <FormikField label="First Name:" name="firstName" {...{ formik }} />
        <FormikField label="Last Name:" name="lastName" {...{ formik }} />
        <FormikField label="Town:" name="town" {...{ formik }} />
        <FormikDropdown label="Passtype:" name="passtype" options={passtypes} {...{ formik }} />
        <FormikDropdown label="Payment Method:" name="payMethod" options={payMethods} {...{ formik }} />
        <FormikField label="Last Four:" name="lastFour" {...{ formik }} />
        <FormikField label="Amount Paid:" name="amountPaid" {...{ formik }} />
        <FormikField label="Employee Signature:" name="signature" {...{ formik }} />
        <Divider />
        <Button style={{ marginRight: 5 }} type="submit" label="Create Pass" loading={formik.isSubmitting} />
        <Button label="Cancel" onClick={() => { setAddPass(false); }} />
      </form>
    </ScrollPanel>
  );
}