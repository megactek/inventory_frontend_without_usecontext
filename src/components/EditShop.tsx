import { Form, Input, message, Modal } from 'antd'
import { FC, useState } from 'react'
import { axiosRequest } from '../utils/functions'
import { shops_url } from '../utils/networks'
import { DataProps, ModalFormProps } from '../utils/types'

const EditShop: FC<ModalFormProps> = ({ visible, setClose, editForm }) => {
    const [Loading, setLoading] = useState<boolean>(false)
    const handleEdit = async (values: DataProps) => {
        setLoading(true)
        const response = await axiosRequest({
            url: `${shops_url}/${editForm?.getFieldValue('id')}`,
            method: 'patch',
            hasAuth: true,
            showError: true,
            payload: values
        })
        if (response) {
            editForm?.resetFields()
            setLoading(false)
            setClose()
            setTimeout(() => {
                message.success('edit shop successful')
            }, 1000)
        }

    }
    return (
        <Modal
            open={visible}
            confirmLoading={Loading}
            title='Edit Shop'
            maskClosable={false}
            okText='Edit'
            onOk={() => editForm?.submit()}
            onCancel={() => setClose()}
        >
            <Form
                form={editForm}
                layout='horizontal'
                onFinish={(values) => handleEdit(values)}
            >
                <Form.Item label={'Shop Name'} name={'name'} rules={[{ required: true, message: 'enter shop name' }]}>
                    <Input type='text' />
                </Form.Item>
            </Form>
        </Modal>
    )
}

export default EditShop