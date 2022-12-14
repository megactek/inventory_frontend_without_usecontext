import { Avatar, Card, Col, Row } from 'antd'
import Meta from 'antd/es/card/Meta'
import { FC, useEffect, useState } from 'react'
import { useGetMe, useGetShops } from '../utils/hooks'
import { DataProps } from '../utils/types'
import moment from 'moment'

const Account: FC = () => {
    const [UserData, setUserData] = useState<DataProps>()
    const [, setLoading] = useState(false)
    const [Shops, setShops] = useState<DataProps[]>([])
    const [UserShop, setUserShop] = useState<string>('')
    useGetShops(setShops, setLoading)
    useGetMe(setUserData, setLoading)
    useEffect(() => {
        if (Shops?.length) {
            setUserShop((Shops.filter(item => item.id === UserData?.shop_id)[0].name as string))
        }
    }, [Shops])
    return (
        <div className="account-card">
            <Row>
                <Col span={15} push={2}>
                    <Card
                        title={'About Staff'}
                        style={{ width: 400 }}
                        cover={
                            <img
                                alt="example"
                                src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png"
                            />
                        }
                    >
                        <Meta
                            avatar={<Avatar src="https://joeschmoe.io/api/v1/random" />}
                            title={String(UserData?.fullname)}
                            description="Staff"
                        />
                    </Card>
                </Col>
                <Col span={8} style={{ marginLeft: '10px' }} pull={4}>
                    <Card title="Staff Details">
                        <p>Full name: {String(UserData?.fullname)}</p>
                        <p>Email:  {String(UserData?.email)}</p>
                        <p>Role:  {String(UserData?.role)}</p>
                        <p>Shop:  {String(UserShop)}</p>
                        <p>Last Login: {String(moment((UserData?.last_login as string)).format('lll'))}</p>
                        <p>Joined on: {String(moment((UserData?.created_at as string)).format('lll'))}</p>
                    </Card>
                </Col>
            </Row>
        </div>
    )
}

export default Account