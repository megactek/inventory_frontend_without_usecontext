import { ColumnsType } from 'antd/es/table'
import { FC, Fragment, useState } from 'react'
import AddInventory from '../components/AddInventory'
import AddInventoryCSV from '../components/AddInventoryCSV'
import ContentLayout from '../components/ContentLayout'
import { axiosRequest, getInventories } from '../utils/functions'
import { useGetInventories } from '../utils/hooks'
import Highlighter from 'react-highlight-words';
import { DataProps, ModalEnum } from '../utils/types'
import { Avatar, Button, Input, message, Popconfirm, Space } from 'antd'
import { DeleteOutlined, FileExcelOutlined, UserOutlined } from '@ant-design/icons'
import { inventory_url } from '../utils/networks'

const Inventories: FC = () => {
    const [Inventories, setInventories] = useState<DataProps[]>([])
    const [ModalState, setModalState] = useState(ModalEnum.off)
    const [Fetching, setFetching] = useState<boolean>(false)
    const [SearchText, setSearchText] = useState('')
    const searchInput = (<Fragment><Input.Search placeholder="input search text" allowClear onSearch={(value) => setSearchText(value)} style={{ width: 200, marginRight: 10 }} size="large" onChange={(e) => setSearchText(e.target.value)} /><Button onClick={() => setModalState(ModalEnum.csv)} style={{ marginRight: '10px', background: '#000d63', color: '#fff' }} size='large' type={'default'}>Add inventory csv</Button></Fragment>)

    const handleDelete = async (value: number) => {

        const response = await axiosRequest({
            method: 'delete',
            url: `${inventory_url}/${value}/`,
            hasAuth: true,
        })
        if (response) {
            message.success("item deleted")
        }
    }
    const columns: ColumnsType<DataProps> = [
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
            width: '20%',
            filteredValue: [SearchText],
            onFilter: (value, record) => (
                String(record.name)
                    .toLowerCase()
                    .includes((value as string).toLowerCase()) ||
                String(record.group_name)
                    .toLowerCase()
                    .includes((value as string).toLowerCase()) ||
                String(record.code)
                    .toLowerCase()
                    .includes((value as string).toLowerCase())
            ),
            render: (item) =>
                String(item).toLowerCase().includes((SearchText)) ? (
                    <Highlighter
                        highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
                        searchWords={[SearchText]}
                        autoEscape
                        textToHighlight={item ? item.toString() : ''}
                    />
                ) : (
                    item
                ),

        },
        {
            title: 'Code',
            dataIndex: 'code',
            key: 'code',
        },
        {
            title: 'Image',
            dataIndex: 'photo',
            key: 'photo',
            render: (item) => <Avatar shape="square" size={40} icon={item === null ? <FileExcelOutlined /> : ""} src={item} />

        },
        {
            title: 'Group',
            dataIndex: 'group_name',
            key: 'group_name',
            render: (item) =>
                item.toString().toLowerCase().includes((SearchText)) ? (
                    <Highlighter
                        highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
                        searchWords={[SearchText]}
                        autoEscape
                        textToHighlight={item ? item.toString() : ''}
                    />
                ) : (
                    item
                )

        },
        {
            title: 'Total',
            dataIndex: 'total',
            key: 'total',

        },
        {
            title: 'Remaining',
            dataIndex: 'remaining',
            key: 'remaining',

        },
        {
            title: 'Price',
            dataIndex: 'price',
            key: 'price',

        },
        {
            title: 'Action',
            dataIndex: 'action',
            key: 'action',
            render: (item) => <Space>
                <Popconfirm title={'Are you sure to delete this inventory?'} okText="delete" cancelText={'no'} onConfirm={() => handleDelete(item)} >
                    <DeleteOutlined style={{ fontSize: '13px', color: '#eb2f96', cursor: 'pointer' }} label={'Delete'} />
                </Popconfirm>
            </Space>

        },
    ]
    const data: DataProps[] = Inventories.map((item, index) => ({
        key: index, name: item.name, code: item.code, total: item.total, remaining: item.remaining, group_name: (item.group as DataProps).name, photo: item.photo,
        price: item.price, action: item.id
    }))
    const onInventoryChange = () => {
        setModalState(ModalEnum.off)
        getInventories({ setInventories, setFetching })
    }
    useGetInventories(setInventories, setFetching)
    return (
        <Fragment>
            <ContentLayout title={'INVENTORY'} data={data} column={columns} buttonText={'add inventory'} buttonClick={() => setModalState(ModalEnum.add)} loading={Fetching} searchInput={searchInput} />

            <AddInventory visible={ModalState === ModalEnum.add} setClose={onInventoryChange} />

            <AddInventoryCSV visible={ModalState === ModalEnum.csv} setClose={onInventoryChange} />
        </Fragment>
    )
}

export default Inventories