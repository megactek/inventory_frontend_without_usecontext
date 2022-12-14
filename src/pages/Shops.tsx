import { Form, Input, message, Popconfirm, Space } from 'antd'
import { ColumnsType } from 'antd/es/table'
import { FC, Fragment, useState } from 'react'
import AddShop from '../components/AddShop'
import ContentLayout from '../components/ContentLayout'
import { axiosRequest, getShops } from '../utils/functions'
import { useGetShops } from '../utils/hooks'
import { DataProps, ModalEnum } from '../utils/types'
import Highlighter from 'react-highlight-words';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons'
import { shops_url } from '../utils/networks'
import EditShop from '../components/EditShop'

const Shops: FC = () => {
    const [ModalState, setModalState] = useState<ModalEnum>(ModalEnum.off)
    const [Shops, setShops] = useState<DataProps[]>([])
    const [Loading, setLoading] = useState<boolean>(false)
    const [formEdit] = Form.useForm()
    const [SearchText, setSearchText] = useState('')
    const dataSource: DataProps[] = [...Shops?.map((item, index) => ({ name: item.name, key: index, actions: item.id }))]
    const columns: ColumnsType<DataProps> = [
        {
            title: 'Shop name',
            dataIndex: 'name',
            key: 'name',
            filteredValue: [SearchText],
            onFilter: (value, record) => (
                String(record.name)
                    .toLowerCase()
                    .includes((value as string).toLowerCase())
            ),
            render: (text) =>
                String(text).toLowerCase().includes((SearchText)) ? (
                    <Highlighter
                        highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
                        searchWords={[SearchText]}
                        autoEscape
                        textToHighlight={text ? String(text) : ''}
                    />

                ) : (
                    text
                )

        },
        {
            title: 'Actions',
            width: '30%',
            dataIndex: 'actions',
            key: 'actions',
            render: (item) => <Space direction={'horizontal'} size={'middle'}>
                <EditOutlined style={{ fontSize: '13px', color: '#08c', cursor: 'pointer' }} onClick={() => { handleEdit(item) }} />
                <Popconfirm title={'Are you sure to delete shop?'} okText={'Delete'} cancelText='No' onConfirm={() => handleDelete(item)} onCancel={() => null}>
                    <DeleteOutlined style={{ fontSize: '13px', color: '#eb2f96', cursor: 'pointer' }} />
                </Popconfirm>
            </Space>
        }


    ];
    const handleDelete = async (item: number) => {
        const response = await axiosRequest({
            url: `${shops_url}/${item}/`,
            method: 'delete',
            hasAuth: true,
            showError: true
        })
        if (response) {
            getShops(setShops, setLoading)
            setTimeout(() => {
                message.success('group added successfully')
            }, 1000)

        }
    }
    const handleEdit = (item: number) => {
        const toEdit = Shops.filter(val => val.id === item)
        if (toEdit.length > 0) {
            formEdit.setFieldsValue({ name: toEdit[0].name, id: toEdit[0].id })
        } else {
            message.error('Shop not found')
        }
        setModalState(ModalEnum.edit)
    }
    useGetShops(setShops, setLoading)
    const onShopChange = () => {
        setModalState(ModalEnum.off)
        getShops(setShops, setLoading)

    }
    const SearchInput = (<Input.Search placeholder='enter search text' allowClear onChange={(e) => setSearchText(e.target.value)} onSearch={(value) => setSearchText(value)} style={{ width: 200, marginRight: 10 }} size="large" />)
    return (
        <Fragment>
            <ContentLayout title={'SHOPS'} data={dataSource} column={columns} buttonText={'Add shop'} buttonClick={() => setModalState(ModalEnum.add)} searchInput={SearchInput} />

            <AddShop visible={ModalState === ModalEnum.add} setClose={() => onShopChange()} />

            <EditShop visible={ModalState === ModalEnum.edit} setClose={() => onShopChange()} editForm={formEdit} />
        </Fragment>
    )
}

export default Shops