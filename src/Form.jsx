import React from 'react';
import { Button, Form, Input, Space } from 'antd';
import axios from 'axios';
const SubmitButton = ({ form, onSuccess }) => {
  const [submittable, setSubmittable] = React.useState(false);

  // Watch all values
  const values = Form.useWatch([], form);
  React.useEffect(() => {
    form
      .validateFields({
        validateOnly: true,
      })
      .then(
        () => {
          setSubmittable(true);
        },
        () => {
          setSubmittable(false);
        },
      );
  }, [form, values]);

  const onSubmit = async () => {
    try {
      const response = await axios.post('https://contact.herokuapp.com/contact', values);
      if (response.status === 201) {
        const data = response.data;
        onSuccess(data);
      } else {
        console.log('error cok');
      }
    } catch (error) {
      console.log('Terjadi kesalahan:', error);
    }
  };

  return (
    <Button type="primary" htmlType="submit" disabled={!submittable} onClick={onSubmit}>
      Submit
    </Button>
  );
};
const FormInput = ({ onSuccess }) => {
  const [form] = Form.useForm();
  return (
    <Form form={form} name="validateOnly" layout="vertical" autoComplete="off">
      <Form.Item
        name="firstName"
        label="First Name"
        rules={[
          {
            required: true,
          },
        ]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name="lastName"
        label="Last Name"
        rules={[
          {
            required: true,
          },
        ]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name="age"
        label="Age"
        rules={[
          {
            required: true,
          },
        ]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name="photo"
        label="Photo"
        rules={[
          {
            required: true,
          },
        ]}
      >
        <Input />
      </Form.Item>
      <Form.Item>
        <Space>
          <SubmitButton form={form} onSuccess={onSuccess} />
          <Button htmlType="reset">Reset</Button>
        </Space>
      </Form.Item>
    </Form>
  );
};
export default FormInput;