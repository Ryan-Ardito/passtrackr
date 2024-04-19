import { useFormik } from 'formik';
import * as Yup from 'yup';

import { ScrollPanel } from "primereact/scrollpanel";
import { Button } from "primereact/button";
import { Divider } from "primereact/divider";

import { HolderData, HolderAction, passtypes, payMethods, Msg, blankHolder } from "../types"
import { FormikDropdown, FormikField } from '../components/FormInput';
import { asyncSleep } from '../api/api';

interface ChildProps {
  selectedHolder: HolderData,
  setSelectedHolder: React.Dispatch<HolderAction>,
  setAddPass: React.Dispatch<boolean>,
}

export const AddPass = ({ selectedHolder, setSelectedHolder, setAddPass }: ChildProps) => {
  const formik = useFormik({
    initialValues: {
      firstName: selectedHolder.first_name,
      lastName: selectedHolder.last_name,
      town: selectedHolder.town,
      passtype: selectedHolder.passtype,
      payMethod: { name: "Credit", code: "credit" },
      lastFour: '',
      amountPaid: '',
      signature: '',
    },
    validationSchema: Yup.object().shape({
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
    }),
    onSubmit: async (values) => {
      console.log('Submitting...');
      await asyncSleep(800);
      console.log('Form submitted:', values);
      formik.setSubmitting(false);
      // setAddPass(false);
    },
  });

  return (
    <ScrollPanel className="holder-box">
      <form onSubmit={formik.handleSubmit}>
        <FormikField
          label="First Name:"
          name="firstName"
          value={formik.values.firstName}
          touched={formik.touched.firstName}
          error={formik.errors.firstName}
          disabled={formik.isSubmitting}
          onChange={formik.handleChange}
        />

        <FormikField
          label="Last Name:"
          name="lastName"
          value={formik.values.lastName}
          touched={formik.touched.lastName}
          error={formik.errors.lastName}
          disabled={formik.isSubmitting}
          onChange={formik.handleChange}
        />

        <FormikField
          label="Town:"
          name="town"
          value={formik.values.town}
          touched={formik.touched.town}
          error={formik.errors.town}
          disabled={formik.isSubmitting}
          onChange={formik.handleChange}
        />

        <FormikDropdown
          label="Passtype:"
          name="passtype"
          value={formik.values.passtype}
          touched={formik.touched.passtype}
          error={formik.errors.passtype}
          options={passtypes}
          disabled={formik.isSubmitting}
          onChange={formik.handleChange}
        />

        <FormikDropdown
          label="Payment Method:"
          name="payMethod"
          value={formik.values.payMethod}
          touched={formik.touched.payMethod?.code}
          error={formik.errors.payMethod?.code}
          options={payMethods}
          disabled={formik.isSubmitting}
          onChange={formik.handleChange}
        />
        <div></div>

        <FormikField
          label="Last Four:"
          name="lastFour"
          value={formik.values.lastFour}
          touched={formik.touched.lastFour}
          error={formik.errors.lastFour}
          disabled={formik.isSubmitting}
          onChange={formik.handleChange}
        />

        <FormikField
          label="Amount Paid:"
          name="amountPaid"
          value={formik.values.amountPaid}
          touched={formik.touched.amountPaid}
          error={formik.errors.amountPaid}
          disabled={formik.isSubmitting}
          onChange={formik.handleChange}
        />

        <FormikField
          label="Employee Signature:"
          name="signature"
          value={formik.values.signature}
          touched={formik.touched.signature}
          error={formik.errors.signature}
          disabled={formik.isSubmitting}
          onChange={formik.handleChange}
        />

        <Divider />
        <Button style={{ marginRight: 5 }} type="submit" label="Create Pass" loading={formik.isSubmitting} />
        <Button label="Cancel" onClick={() => { setSelectedHolder({ type: Msg.Replace, data: blankHolder }); setAddPass(false); }} />
      </form>
    </ScrollPanel>
  );
}