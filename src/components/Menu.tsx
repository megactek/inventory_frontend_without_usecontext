import { FC } from 'react'
import { Menu as Men } from 'antd';
import { useNavigate } from 'react-router-dom';
import { HomeOutlined, UnorderedListOutlined, GroupOutlined, FileTextOutlined, ShopOutlined, UserOutlined, TeamOutlined } from '@ant-design/icons';





const Menu: FC = () => {
    const navigate = useNavigate()
    return (
        <div>
            <Men
                style={{ fontSize: "15px", padding: "5px", minWidth: "100%" }}
                theme="dark"
                mode="inline"

                selectedKeys={[window.location.pathname]}
                onClick={({ key }) => {
                    if (key === 'signout') {

                    } else {
                        navigate(key)
                    }

                }}
                items={[
                    {
                        key: '/dashboard',
                        icon: <HomeOutlined />,
                        label: 'Dashboard',
                    },
                    {
                        key: '/groups',
                        icon: <GroupOutlined />,
                        label: 'Groups',
                    },
                    {
                        key: '/inventory',
                        icon: <UnorderedListOutlined />,
                        label: 'Inventories',
                    },

                    {
                        key: '/invoice',
                        icon: <FileTextOutlined />,
                        label: 'Invoices',
                    },

                    {
                        key: '/shops',
                        icon: <ShopOutlined />,
                        label: 'Shop',
                    },
                    {
                        key: '/users',
                        icon: <TeamOutlined />,
                        label: 'Users',
                    },
                    {
                        key: '/me',
                        icon: <UserOutlined />,
                        label: 'My Account',
                    },

                    {
                        key: '/user_activities',
                        icon: <UnorderedListOutlined />,
                        label: 'User Activities',
                    },
                ]}
            />
        </div>
    )
}

export default Menu