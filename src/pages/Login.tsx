import { notification } from 'antd'
import axios from 'axios'
import { FC, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AuthComponent from '../components/AuthComponent'
import { tokenName } from '../utils/data'
import { axiosRequest } from '../utils/functions'
import { login_url, me_url } from '../utils/networks'
import { CustomAxiosError, DataProps } from '../utils/types'



interface LoginDataProps {
    access_token: string
}
const Login: FC = () => {
    const navigate = useNavigate()
    const [loading, setLoading] = useState<boolean>(false)

    const onSubmit = async (values: DataProps) => {
        setLoading(true)
        const response = await axiosRequest<LoginDataProps>(
            {
                method: 'post',
                url: login_url,
                payload: { ...values },
                showError: true,

            })

        if (response) {
            window.localStorage.setItem(tokenName, response.data.access_token)
            navigate("/dashboard")
        }
        setLoading(false)
    }
    return (
        <AuthComponent onSubmit={onSubmit} loading={loading} />

    )

}

export default Login