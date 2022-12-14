import { Button, Form, Input, message, Modal, notification } from 'antd'
import axios from 'axios'
import { FC, useState } from 'react'
import AuthComponent from '../components/AuthComponent'
import { CustomAxiosError, DataProps } from '../utils/types'
import { login_url, update_password_url } from '../utils/networks'
import { axiosRequest } from '../utils/functions'
import { useNavigate } from 'react-router-dom'
import { ConsoleSqlOutlined } from '@ant-design/icons'



const CheckUser: FC = () => {
    const [ShowModal, setShowModal] = useState<boolean>(false)
    const [ConfirmLoading, setConfirmLoading] = useState<boolean>(false)
    const [loading, setLoading] = useState<boolean>(false)
    const [setpasswordform] = Form.useForm()
    const navigate = useNavigate()
    const onSubmit = async (values: DataProps) => {
        setLoading(true)
        const payload = { ...values, is_new_user: true }
        const response = await axiosRequest<DataProps>({
            url: login_url,
            method: 'post',
            payload: payload,
            showError: true,
        })
        if (response) {
            setShowModal(true)
            setpasswordform.setFieldsValue({ id: response.data.user_id })
            // console
        }
        setLoading(false)
    }
    const handleOk = async (values: DataProps) => {
        setConfirmLoading(true)
        const payload = { password: values.password, user_id: setpasswordform.getFieldValue('id') }
        const response = await axiosRequest({
            method: 'post',
            url: update_password_url,
            payload: payload
        })
        if (response) {
            message.success("password set successful")
            setTimeout(() => navigate("/login"), 1000)
            setShowModal(false)
        }
        setConfirmLoading(false)

    }

    return (<>
        <AuthComponent titleText={'CHECK USER'} buttonText={'CHECK'} linkText={'Login'} isPassword={false} linkPath={'/login'} onSubmit=
            {onSubmit} loading={loading} />
        <Modal
            title="New user"
            open={ShowModal}
            onOk={() => setpasswordform.submit()}
            okText="set password"
            confirmLoading={ConfirmLoading}
            onCancel={() => setShowModal(false)}
            maskClosable={false}

        >
            <Form title='Set Password' form={setpasswordform} onFinish={(values) => handleOk(values)} layout='vertical'>
                <Form.Item name={"password"} label={"Enter password"} rules={[{ required: true, message: "password must be more than 6 characters", min: 6 }]} hasFeedback>
                    <Input.Password />
                </Form.Item>
                <Form.Item name={"cpassword"} dependencies={['password']} label={"Confirm password"} rules={[{ required: true, message: "password must be more than 6 characters", min: 6 },
                ({ getFieldValue }) => ({
                    validator(_, value) {
                        if (getFieldValue('password') === value) {
                            return Promise.resolve()
                        }
                        return Promise.reject(new Error("Passwords do not match"))
                    }
                })]} hasFeedback>
                    <Input.Password />
                </Form.Item>
            </Form>
        </Modal>
    </>
    )
}

export default CheckUser