import { Form, Input, message, Modal, Select } from 'antd'
import { FC, useState } from 'react'
import { axiosRequest } from '../utils/functions'
import { create_user } from '../utils/networks'
import { DataProps, ModalFormProps } from '../utils/types'

const AddUsers: FC<ModalFormProps> = ({ visible, setClose, data }) => {
    const [Loading, setLoading] = useState(false)

    const [form] = Form.useForm()

    const handleAdd = async (values: DataProps) => {
        setLoading(true)
        const response = await axiosRequest({
            url: create_user,
            method: 'post',
            hasAuth: true,
            payload: values,
            showError: true
        })
        if (response) {

            setClose()
            message.success('add user successful')
            return
        }
        setLoading(false)
        return
    }
    return (
        <Modal title='Add user' open={visible} okText={'Add'} onOk={() => form.submit()} onCancel={() => setClose()} confirmLoading={Loading} maskClosable={false}>
            <Form form={form} layout={'horizontal'} autoComplete={'off'} onFinish={(values) => handleAdd(values)}>
                <Form.Item
                    label='Full name:'
                    name={'fullname'}
                    rules={[{ required: true, message: 'enter staff name' }]}
                >
                    <Input type='text' placeholder='Staff full name' />
                </Form.Item>
                <Form.Item label={'Email:'} name={'email'}
                    rules={[{ required: true, message: 'enter staff email' }]}>
                    <Input type='email' placeholder='staff email' />
                </Form.Item>
                <Form.Item label='Role' name={'role'} rules={[{ required: true, message: 'select role for new staff' }]}>
                    <Select placeholder='select staff role'>
                        <Select.Option value={'creator'}>Creator</Select.Option>
                        <Select.Option value={'sale'}>Sale</Select.Option>
                    </Select>
                </Form.Item>
                <Form.Item label='Shop' name={'shop_id'} rules={[{ required: true, message: 'select shop for new staff' }]}>
                    <Select placeholder='select staff shop'>
                        {data?.map((item, index) => <Select.Option key={index} value={item.id}>{String(item.name)}</Select.Option>)}
                    </Select>
                </Form.Item>
            </Form>
        </Modal>
    )
}

export default AddUsers