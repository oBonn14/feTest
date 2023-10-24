import { useState } from 'react'
import { Button, Modal } from 'antd'
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
            onOk={() => setModalOpen(false)}
            onCancel={() => setModalOpen(false)}
            >
                <p>Spontan</p>
                <p>uhuy</p>
            </Modal>
        </>
    )
}

export default ModalButton