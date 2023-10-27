import { useState, useEffect } from 'react';
import axios from 'axios';
import { Form, Input, InputNumber, Popconfirm, Table, Typography } from 'antd';

const editTableCell = ({ editing, dataIndex, title, inputType, children, ...restProps }) => {
  const inputNode = inputType === 'number' ? <InputNumber /> : <Input />;
  return (
    <td {...restProps}>
      {editing ? (
        <Form.Item
          name={dataIndex}
          style={{
            margin: 0,
          }}
          rules={[
            {
              required: true,
              message: `Please Input ${title}!`,
            },
          ]}
        >
          {inputNode}
        </Form.Item>
      ) : (
        children
      )}
    </td>
  );
};

const TableData = () => {
  const [form] = Form.useForm();
  const [data, setData] = useState([]);
  const [editingKey, setEditingKey] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = () => {
    axios.get('https://contact.herokuapp.com/contact').then((response) => {
      const apiData = response.data.data;
      setData(apiData);
    });
  };

  const isEditing = (record) => record.id === editingKey;

  const edit = (record) => {
    form.setFieldsValue({
      firstName: '',
      lastName: '',
      age: '',
      photo: '',
      ...record,
    });
    setEditingKey(record.id);
  };

  const cancel = () => {
    setEditingKey('');
  };

  const save = async (key) => {
    try {
      const row = await form.validateFields();
      const newData = [...data];
      const index = newData.findIndex((item) => key === item.id);
  
      if (index > -1) {
        // Update data di server
        await updateData(newData[index]);
        setData(newData);
        setEditingKey('');
      } else {
        newData.push(row);
        setData(newData);
        setEditingKey('');
      }
    } catch (errInfo) {
      console.log('validate Failed: ', errInfo);
    }
  };

  async function updateData(updatedRow) {
    try {
      const { id, ...dataWithoutId } = updatedRow; // Pisahkan ID dari data
      const response = await axios.put(`https://contact.herokuapp.com/contact/${id}`, dataWithoutId, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      if (response.status === 200) {
        // Update data di tabel
        const newData = [...data];
        const index = newData.findIndex((item) => id === item.id);
        newData[index] = updatedRow;
        setData(newData);
        console.log('Data berhasil diperbarui');
      } else {
        console.error('Gagal memperbarui data:', response.statusText);
      }
    } catch (error) {
      console.error('Gagal memperbarui data:', error);
    }
  }
  

  const columns = [
    {
      title: 'First Name',
      dataIndex: 'firstName',
      width: '25%',
      editable: true,
    },
    {
      title: 'Last Name',
      dataIndex: 'lastName',
      width: '15%',
      editable: true,
    },
    {
      title: 'Age',
      dataIndex: 'age',
      width: '10%',
      editable: true,
    },
    {
        title: 'Photo',
        dataIndex: 'photo',
        width: '40%',
        editable: false,
        render: (photo, record) => (
          <img src={photo} alt={record.firstName} style={{ maxWidth: '100px' }} />
        ),
      },
    {
        title: 'operation',
        dataIndex: 'operation',
        render: (_, record) => {
          const editable = isEditing(record);
          return editable ? (
            <span>
              <Typography.Link
                onClick={() => save(record.id)}
                style={{
                  marginRight: 8,
                }}
              >
                Save
              </Typography.Link>
              <Popconfirm title="Sure to cancel?" onConfirm={cancel}>
                <a>Cancel</a>
              </Popconfirm>
            </span>
          ) : (
            <Typography.Link
              disabled={editingKey !== ''}
              onClick={() => edit(record)}
            >
              Edit
            </Typography.Link>
          );
        },
      },
    ];

  const mergedColumns = columns.map((col) => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: (record) => ({
        record,
        inputType: col.dataIndex === 'age' ? 'number' : 'text',
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record),
      }),
    };
  });

  return (
    <Form form={form} component={false}>
      <Table
        components={{
          body: {
            cell: editTableCell,
          },
        }}
        bordered
        dataSource={data}
        columns={mergedColumns}
        rowClassName="editable-row"
        pagination={{
          onChange: cancel,
        }}
      />
    </Form>
  );
};

export default TableData;
