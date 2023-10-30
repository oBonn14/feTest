import { useState, useEffect } from 'react';
import axios from 'axios';
import { Form, Input, InputNumber, Popconfirm, Table, Typography } from 'antd';
import { EditOutlined, BookOutlined, DeleteOutlined } from '@ant-design/icons';
import ModalDetailUser from './ModalDetailUser'

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
  const [detail, setDetail] = useState({})
  const [detailUserModalVisible, setDetailUserModalVisible] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);


  const handleDelete = async (record) => {
    setIsDeleting(true);
  
    const id = record.id;
  
    const response = await axios.delete(`https://contact.herokuapp.com/contact/${id}`);
  
    if (response.status === 204) {
      setData(data.filter((item) => item.id !== id));
    } else {
      // tampilkan notif error
      alert('Gagal menghapus data');
    }
  
    setIsDeleting(false);
  };
  
  

  const handleDetailUserModalOpen = (record) => {
    const detail = JSON.parse(record.data);
    setDetail(detail);
    setDetailUserModalVisible(true)
  };

  const handleDetailUserModalClose = () => {
    setDetailUserModalVisible(false);
  };
  


  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = () => {
    axios.get('https://contact.herokuapp.com/contact').then((response) => {
      const apiData = response.data.data;
      setData(apiData);
    });
  };

  const detailUser = async (record) => {
    try{
      const response = await axios.get(`https://contact.herokuapp.com/contact/${record.id}`)
      console.log('response detail : ', response);
       setDetail(response.data)
       if(response === 200){
        console.log('ok aman', response.data)
         return response ===200
       }
       setDetailUserModalVisible(true)
    } catch(err){
      console.log('gagal ambil data: ',err)
    }
  }

  const isDetail = (record) => record.id === detail

  const getDetail = (record) => {
    form.setFieldValue({
      firstName:'',
      lastName:'',
      age:'',
      photo:'',
      ...record,
    })
    setDetail(record.id)
  }

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
        const id = newData[index].id;
        await updateData(row, id);
        newData[index] = { ...newData[index], ...row }
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

  async function updateData(updatedRow, id) {
    try {
      const dataWithoutId = updatedRow;
      const response = await axios.put(`https://contact.herokuapp.com/contact/${id}`, dataWithoutId, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.status === 201) {
        console.log('Data berhasil diperbarui');
        alert('Update Data Success')
      } else {
        console.error('Gagal memperbarui data:', response.statusText);
        alert('test')
      }
    } catch (error) {
      console.error('Gagal memperbarui data:', error);
      alert('error test')
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
        width: '30%',
        editable: true,
        render: (photo, record) => (
          <img src={photo} alt={record.firstName} style={{ maxWidth: '70px', height: '70px', borderRadius: '50%'}} />
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
            <>
            <Typography.Link
              disabled={editingKey !== ''}
              onClick={() => edit(record)}
              >
              <EditOutlined style={{ marginRight: '20px'}} />
            </Typography.Link>
            
            <Typography.Link onClick={() => detailUser(record)}>
            <BookOutlined  style={{ marginRight: '20px'}}/>
          </Typography.Link>
          
          <Typography.Link onClick={() => handleDelete(record)} loading={isDeleting}>
          <DeleteOutlined />
          </Typography.Link>
              </>
          )
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
    <>
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
    {detail && (
      <ModalDetailUser
      visible={detailUserModalVisible}
      onCancel={handleDetailUserModalClose}
      record={detail}
      />
      )}
    </>
  );
  
};

export default TableData;
