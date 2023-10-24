import { useState } from 'react'
import { Button, Modal } from 'antd'
import FormInput from './Form'


const ModalButton = () => {
    const [ modalOpen, setModalOpen ] = useState(false)
    return (
        <>
            <Button type='primary' onClick={() => setModalOpen(true)}>
                Add Contact
            </Button>
            <Modal
            title='Add Contact'
            centered
            open={modalOpen}
            onOk={() => setModalOpen(false) }
            onCancel={() => setModalOpen(false)}
            >
                <FormInput/>
            </Modal>
        </>
    )
}

export default ModalButton