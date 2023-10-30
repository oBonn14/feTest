import Modal from 'antd/lib/modal/Modal';

const ModalDetailUser = ({ visible, onCancel, record }) => {
    const detail = record.data;
  
    return (
      <Modal
        title={`Detail User ${detail ? detail.firstName : ''}`}
        visible={visible}
        onCancel={onCancel}
        footer={null}
      >
        <ul>
          <li>First Name: {detail ? detail.firstName : ''}</li>
          <li>Last Name: {detail ? detail.lastName : ''}</li>
          <li>Age: {detail ? detail.age : ''}</li>
          <li>  <img src={detail && detail.photo} alt={'photo'} style={{ maxWidth: '70px', height: '70px', borderRadius: '50%'}} /></li>
        </ul>
      </Modal>
    );
  };

export default ModalDetailUser;
