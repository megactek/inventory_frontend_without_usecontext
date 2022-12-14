import { Form, Input, Modal, Select } from 'antd'
import { FC } from 'react'
import { ModalFormProps } from '../utils/types'

const EditUsers: FC<ModalFormProps> = ({ visible, setClose, editForm, data }) => {
    const handleEdit = async (value: any) => {

    }
    return (
        <Modal
            title='Edit Group'
            maskClosable={false}
            okText='Edit'
            onOk={() => editForm?.submit()}
            open={visible} onCancel={() => setClose()}>

            <Form form={editForm} layout={'horizontal'} autoComplete={'off'} onFinish={(values) => handleEdit(values)}>
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

export default EditUsers