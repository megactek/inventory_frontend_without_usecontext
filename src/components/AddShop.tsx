import { Form, Input, message, Modal } from 'antd'
import { FC, useState } from 'react'
import { axiosRequest } from '../utils/functions'
import { shops_url } from '../utils/networks'
import { DataProps, ModalFormProps } from '../utils/types'

const AddShop: FC<ModalFormProps> = ({ visible, setClose }) => {
    const [form] = Form.useForm()
    const [Loading, setLoading] = useState<boolean>(false)

    const handleAdd = async (values: DataProps) => {
        setLoading(true)
        const response = await axiosRequest({
            url: shops_url,
            method: 'post',
            payload: values,
            hasAuth: true,
            showError: true
        })
        if (response) {
            form.resetFields()
            setClose()
            message.success("added group successfully")

        }
        setLoading(false)

    }
    return (
        <Modal
            title='Add shop'
            maskClosable={false}
            onOk={() => form.submit()}
            onCancel={() => setClose()}
            confirmLoading={Loading}
            open={visible}
        >
            <Form form={form} layout={'horizontal'} autoComplete={'off'} onFinish={(values) => handleAdd(values)}>
                <Form.Item label='Shop name:' name={'name'} rules={[{ required: true, message: 'enter shop name' }]}>
                    <Input type='text' placeholder='Shop name' />
                </Form.Item>
            </Form>
        </Modal>
    )
}

export default AddShop