import { HolderData, HolderAction, PassType, blankHolder } from "../App"

import { ScrollPanel } from "primereact/scrollpanel";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { Button } from "primereact/button";
import { Divider } from "primereact/divider";

import { useFormik } from 'formik';
import * as Yup from 'yup';

const payMethods = [
  { name: "Credit", code: "credit" },
  { name: "Cash", code: "cash" },
]

const passtypes: PassType[] = [
  { name: "ten_punch", code: "10x Punch" },
  { name: "six_punch", code: "6x Punch" },
  { name: "annual", code: "Annual" },
  { name: "six_month", code: "6 Month" },
  { name: "free_pass", code: "Free Pass" },
  { name: "three_facial", code: "3x Facial" },
  { name: "six_facial", code: "6x Facial" },
];

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
      lastFour: Yup.number(),
      amountPaid: Yup.number().required('Amount Paid is required'),
      paymentMethod: Yup.string().required('Payment method is required'),
      signature: Yup.string().required('Employee Signature is required'),
    }),
    onSubmit: values => {
      console.log('Form submitted:', values);
      setAddPass(false);
    },
  });

  return (
    <ScrollPanel className="holder-box">
      <form onSubmit={formik.handleSubmit}>
        <div>First Name:</div>
        <InputText
          className="form-text-input p-inputtext-sm"
          value={selectedHolder.first_name}
          onChange={(e) => setSelectedHolder({
            type: 'set_first_name',
            data: e.target.value,
          })}
        />

        <div>Last Name:</div>
        <InputText
          className="form-text-input p-inputtext-sm"
          value={selectedHolder.last_name}
          onChange={(e) => setSelectedHolder({
            type: 'set_last_name',
            data: e.target.value,
          })}
        />

        <div>Town:</div>
        <InputText
          className="form-text-input p-inputtext-sm"
          value={selectedHolder.town}
          onChange={(e) => setSelectedHolder({
            type: 'set_town',
            data: e.target.value,
          })}
        />

        <div>Passtype:</div>
        <Dropdown
          scrollHeight="400px"
          value={selectedHolder.passtype}
          options={passtypes}
          optionLabel="code"
          onChange={(e) => {
            setSelectedHolder({
              type: 'set_passtype',
              data: e.value,
            });
          }}
        />

        <div>Payment Method:</div>
        <Dropdown
          scrollHeight="400px"
          value={formik.values.payMethod}
          options={payMethods}
          optionLabel="name"
          onChange={(e) => {
            formik.setFieldValue('payMethod', e.value);
          }}
        />

        <div>Last Four:</div>
        <InputText
          className="form-text-input p-inputtext-sm"
          name="lastFour"
          value={formik.values.lastFour}
          onChange={formik.handleChange}
        />
        {formik.touched.lastFour && formik.errors.lastFour && (
          <div style={{ color: 'red' }}>{formik.errors.lastFour}</div>
        )}

        <div>Amount Paid:</div>
        <InputText
          className="form-text-input p-inputtext-sm"
          name="amountPaid"
          value={formik.values.amountPaid}
          onChange={formik.handleChange}
        />
        {formik.touched.amountPaid && formik.errors.amountPaid && (
          <div style={{ color: 'red' }}>{formik.errors.amountPaid}</div>
        )}

        <div>Employee Signature:</div>
        <InputText
          className="form-text-input p-inputtext-sm"
          name="signature"
          value={formik.values.signature}
          onChange={formik.handleChange}
        />
        {formik.touched.signature && formik.errors.signature && (
          <div style={{ color: 'red' }}>{formik.errors.signature}</div>
        )}

        <Divider />
        <Button style={{ marginRight: 5 }} type="submit" label="Create Pass" />
        <Button label="Cancel" onClick={() => {setSelectedHolder({type: "replace", data: blankHolder}); setAddPass(false);}} />
      </form>
    </ScrollPanel>
  );
}