import { FC } from 'react'
import { Breadcrumb, Button, Layout as Layt } from 'antd';
import React from 'react';
import Sider from './Sider';
import { Footer } from 'antd/es/layout/layout';
import Menu from './Menu';
import Navbar from './Navbar';
import { logout } from '../utils/functions';
import { Link } from 'react-router-dom';
import { Menu as MEnu } from 'antd'

const { Header, Content } = Layt;

const Layout: FC<{ children: React.ReactElement }> = ({ children }) => {
    return (<Layt style={{ margin: 0, padding: 0 }} >


        <Sider menu={<Menu />} />
        <Layt className="site-layout">
            <Header className="site-layout-background" style={{ padding: 0 }}>
                <div>
                    <Navbar menu={<Menu />} />

                </div>
                <div className='header-buttons'>
                    <Link to={"/invoice_creation"} style={{ marginRight: '30px' }}>
                        <Button size={'large'} type={'dashed'}>Create invoice</Button>
                    </Link>
                    <Button size={'middle'} onClick={() => logout()} danger ghost>Logout</Button>

                </div>
            </Header>

            <Content style={{ margin: '0 10px', overflow: 'initial' }}>
                <Breadcrumb style={{ margin: '16px 0' }}>
                    <Breadcrumb.Item>Home</Breadcrumb.Item>
                    <Breadcrumb.Item>{window.location.pathname.replace('/', '').toLocaleUpperCase()}</Breadcrumb.Item>
                </Breadcrumb>
                <div style={{ padding: 5, minHeight: 360 }}>
                    {children}
                </div>
            </Content>
            <Footer style={{ textAlign: 'center' }}>Ant Design &copy; 2022 Created by Megac</Footer>

        </Layt ></Layt>
    )
}

export default Layout;