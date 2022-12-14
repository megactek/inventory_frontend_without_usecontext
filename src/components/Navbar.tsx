import React, { useState, FC } from "react";
import { Drawer, Button } from "antd";
import { MenuUnfoldOutlined } from "@ant-design/icons";

const Navbar: FC<{ menu: React.ReactElement }> = ({ menu }) => {
    const [visible, setVisible] = useState(false);
    return (
        <nav className="navbar">
            <MenuUnfoldOutlined className="menu trigger" onClick={() => setVisible(true)} style={{ fontSize: "24px" }} />
            <Drawer
                title="Menu"
                placement="left"
                width={250}
                bodyStyle={{ backgroundColor: "#001529", color: "#fff" }}
                onClose={() => setVisible(false)}
                open={visible}
                maskClosable={true}
            >
                <div className="logo"><span>Inventory</span></div>
                {menu}
            </Drawer>
        </nav>
    );
};
export default Navbar;