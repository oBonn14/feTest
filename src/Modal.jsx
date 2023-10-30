
import { useState } from 'react';
import { Button, Modal } from 'antd';
import FormInput from '../src/Form';

const ModalButton = ({ onSuccess }) => {
    const [modalOpen, setModalOpen] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
  
    const openModal = () => {
      setModalOpen(true);
    };
  
    const closeModal = () => {
      setModalOpen(false);
    };

    const handleSuccess = (message) => {
      setSuccessMessage(message);
      closeModal();
    };
  
    return (
      <>
        <Button type='primary' onClick={openModal} style={{marginBottom: 20, marginRight: 10}}>
          Add Contact
        </Button>
        <Modal
          title='Add Contact'
          centered
          visible={modalOpen}
          onOk={closeModal}
          onCancel={closeModal}
          footer={null}
        >
          <FormInput onSuccess={handleSuccess} />
        </Modal>
      </>
    );
  };

export default ModalButton;
