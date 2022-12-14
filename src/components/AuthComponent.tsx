import { EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons'
import { Button, Form, Input } from 'antd'
import { FC } from 'react'
import { Link } from 'react-router-dom'
import { AuthComponentProps } from '../utils/types'


const AuthComponent: FC<AuthComponentProps> = (
    {
        titleText = "Sign In", isPassword = true, buttonText = "LOGIN", linkText = "New User? click here", linkPath = "/check_user",
        onSubmit, loading, isPasswordCreate = false
    }
) => {

    return (
        <div className="container">
            <div className="login">
                <div className="inner">
                    <div className="header">
                        <h3>{titleText}</h3>
                        <h2>Inventory</h2>
                    </div>
                    <Form
                        layout='vertical'
                        autoComplete='off' onFinish={onSubmit}>

                        {

                            isPasswordCreate ? (<Form.Item label="Enter password" name={"cpassword"} rules={[{ required: true, message: 'Please enter password' }]}>
                                <Input type='password' placeholder='Enter password' />
                            </Form.Item>) : (<Form.Item label="Email" name={"email"} rules={[{ required: true, message: 'Please enter email' }]}>
                                <Input type='email' placeholder='Enter Email' />
                            </Form.Item>)
                        }
                        {isPassword && <Form.Item label={isPasswordCreate ? "Confirm password" : "Password"} name={"password"} rules={[{ required: true, message: 'Please enter password', }]}>
                            <Input.Password type='password' placeholder='Enter Password' iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)} />
                        </Form.Item>}
                        <Form.Item>
                            <Button htmlType='submit' type='primary' block loading={loading}>
                                {buttonText}
                            </Button>
                        </Form.Item>
                    </Form>
                    <Link to={linkPath}>{linkText}</Link>
                </div>
            </div>
        </div>
    )
}

export default AuthComponent