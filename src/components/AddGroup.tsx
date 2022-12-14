import { Form, Input, message, Modal, Select } from 'antd'
import { FC, useState } from 'react'
import { axiosRequest } from '../utils/functions'
import { groups_url } from '../utils/networks'
import { DataProps, ModalFormProps } from '../utils/types'

const { Item } = Form
const AddGroup: FC<ModalFormProps> = ({ visible, setClose, data }) => {
    const [form] = Form.useForm()

    const [awaitLoading, setAwaitLoading] = useState(false)
    const handleSubmit = async (values: DataProps) => {
        setAwaitLoading(true)
        const response = await axiosRequest({
            url: groups_url,
            method: 'post',
            hasAuth: true,
            payload: values
        })
        if (response) {
            form.resetFields()

            setClose()
            message.success("added group successfully")
        }
        setAwaitLoading(false)

    }
    return (
        <Modal confirmLoading={awaitLoading} open={visible} title={'Add Group'} okText='Add' onOk={() => form.submit()} onCancel={() => setClose()} maskClosable={false} >
            <Form
                layout='vertical'
                autoComplete='off' form={form} onFinish={(values) => handleSubmit(values)}>
                <Item label='Group Name' name={'name'}
                    rules={[{ required: true, message: 'enter group name' }]}>
                    <Input />
                </Item>
                <Item label='Belongs To' name='belongs_to_id'>
                    <Select>
                        <Select.Option value="">select a group</Select.Option>
                        {data?.map((item, index) => <Select.Option key={index} value={item.id}>{String(item.name)}</Select.Option>)}
                    </Select>
                </Item>
            </Form>
        </Modal >
    )
}

export default AddGroup