import { Form, Input, message, Modal, Select } from 'antd'
import { FC } from 'react'
import { axiosRequest } from '../utils/functions'
import { groups_url } from '../utils/networks'
import { DataProps, GroupProps, ModalFormProps } from '../utils/types'

const EditGroup: FC<ModalFormProps> = ({ visible, setClose, editForm, data }) => {

    const handleEdit = async (values: DataProps) => {
        const response = await axiosRequest({
            method: 'patch',
            url: `${groups_url}/${editForm?.getFieldValue('group_id')}`,
            payload: values,
            hasAuth: true
        })
        if (response) {
            setClose()
            setTimeout(() => {
                message.success('Edit group successful')
            }, 1000)
            return
        }

    }
    return (
        <Modal
            title='Edit Group'
            maskClosable={false}
            okText='Edit'
            onOk={() => editForm?.submit()}
            open={visible} onCancel={() => setClose()}>
            <Form form={editForm} layout={'vertical'} onFinish={(values) => handleEdit(values)}>
                <Form.Item
                    label={'Group Name'} name={'name'}>
                    <Input />
                </Form.Item>
                <Form.Item name={'belongs_to_id'} label={'Belongs to'}>
                    <Select placeholder={String(editForm?.getFieldValue('belongs_to_name'))}>
                        {data?.map((item, index) => <Select.Option key={index} value={item.id}>{String(item.name)}</Select.Option>)}
                    </Select>
                </Form.Item>
            </Form>
        </Modal>
    )
}

export default EditGroup