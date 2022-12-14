import Layout from './Layout'
import { FC, useState } from 'react'
import { useAuth } from '../utils/hooks'
import { logout } from '../utils/functions'
import { Skeleton } from 'antd'

interface PassChild {
    children: React.ReactElement
}
const AuthRoute: FC<PassChild> = ({ children }) => {
    const [loading, setLoading] = useState<boolean>(true)
    useAuth({ errorCallBack: () => logout(), successCallBack: () => setLoading(false) })
    if (loading) {
        return <Skeleton />
    }
    return (
        <Layout>{children}</Layout>
    )
}

export default AuthRoute