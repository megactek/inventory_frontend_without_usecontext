import { Layout } from 'antd'
import React, { FC } from 'react'

const Sider: FC<{ menu: React.ReactElement }> = ({ menu }) => {
    return (

        <Layout.Sider
            className="sidebar"
            breakpoint={"lg"}
            collapsedWidth={0}
            trigger={null}
            style={{
                overflow: 'auto',
                height: '100vh',
                position: 'fixed',
                left: 0,
                top: 0,
                bottom: 0,
            }}
        >
            <div className="logo"><span>Inventory</span></div>
            {menu}
        </Layout.Sider>
    )
}

export default Sider