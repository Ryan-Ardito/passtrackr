import { useFormik } from 'formik';
import * as Yup from 'yup';

import { ScrollPanel } from "primereact/scrollpanel";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { Button } from "primereact/button";
import { Divider } from "primereact/divider";

import { HolderData, HolderAction, passtypes, payMethods, Msg, blankHolder } from "../types"

interface ChildProps {
  selectedHolder: HolderData,
  setSelectedHolder: React.Dispatch<HolderAction>,
  setAddPass: React.Dispatch<boolean>,
}

interface InputFieldProps {
  label: string,
  value: string,
  onChange: (value: string) => void,
}

const InputField: React.FC<InputFieldProps> = ({ label, value, onChange }) => {
  return (
    <>
      <div className="form-text">
        {label}
      </div>
      <InputText className="form-text-input p-inputtext-sm" value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </>
  )
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
      amountPaid: Yup.number().positive().required('required'),
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

        <div className="form-text">
          Passtype:
        </div>
        <Dropdown
          scrollHeight="400px"
          value={selectedHolder.passtype}
          options={passtypes}
          optionLabel="code"
          onChange={(e) => {
            setSelectedHolder({
              type: Msg.SetPasstype,
              data: e.value,
            });
          }}
        />

        <div className="form-text">
          Payment Method:
        </div>
        <Dropdown
          scrollHeight="400px"
          value={formik.values.payMethod}
          options={payMethods}
          optionLabel="name"
          onChange={(e) => {
            formik.setFieldValue('payMethod', e.value);
          }}
        />

        <div></div>
        <div className="form-text required">
          Last Four:
        </div>
        {formik.touched.lastFour && formik.errors.lastFour && (
          <div style={{ color: 'red', display: 'inline-block' }}>{formik.errors.lastFour}</div>
        )}
        <InputText
          className="form-text-input p-inputtext-sm"
          name="lastFour"
          value={formik.values.lastFour}
          onChange={formik.handleChange}
        />

        <div className="form-text required">
          Amount Paid:
        </div>
        {formik.touched.amountPaid && formik.errors.amountPaid && (
          <div style={{ color: 'red', display: 'inline-block' }}>{formik.errors.amountPaid}</div>
        )}
        <InputText
          className="form-text-input p-inputtext-sm"
          name="amountPaid"
          value={formik.values.amountPaid}
          onChange={formik.handleChange}
        />

        <div className="form-text required">
          Employee Signature:
        </div>
        {formik.touched.signature && formik.errors.signature && (
          <div style={{ color: 'red', display: 'inline-block' }}>{formik.errors.signature}</div>
        )}
        <InputText
          className="form-text-input p-inputtext-sm"
          name="signature"
          value={formik.values.signature}
          onChange={formik.handleChange}
        />

        <Divider />
        <Button style={{ marginRight: 5 }} type="submit" label="Create Pass" />
        <Button label="Cancel" onClick={() => { setSelectedHolder({ type: Msg.Replace, data: blankHolder }); setAddPass(false); }} />
      </form>
    </ScrollPanel>
  );
}