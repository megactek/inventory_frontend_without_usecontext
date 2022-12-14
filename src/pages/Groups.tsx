import { Input, message, Popconfirm, Space, Form } from 'antd'
import { ColumnsType } from 'antd/es/table'
import { FC, Fragment, useState } from 'react'
import ContentLayout from '../components/ContentLayout'
import { useGetGroups } from '../utils/hooks'
import { DataProps, ModalEnum } from '../utils/types'
import Highlighter from 'react-highlight-words';
import AddGroup from '../components/AddGroup'
import { axiosRequest, getGroups } from '../utils/functions'
import { DeleteOutlined, EditOutlined } from '@ant-design/icons'
import EditGroup from '../components/EditGroup'
import { groups_url } from '../utils/networks'


const Groups: FC = () => {
    const [groups, setGroups] = useState<DataProps[]>([])
    const [showModal, setShowModal] = useState<ModalEnum>(ModalEnum.off)
    const [fetching, setFetching] = useState<boolean>(true)
    const [searchText, setSearchText] = useState('');
    const searchInput = (<Input.Search placeholder="input search text" allowClear onSearch={(value) => setSearchText(value)} style={{ width: 200, marginRight: 10 }} size="large" onChange={(e) => setSearchText(e.target.value)} />)

    const [form] = Form.useForm()

    const dataSource: DataProps[] = [...groups?.map((item, index) => ({
        key: index, name: item?.name, total_items: item?.total_items, belongs_to: (item?.belongs_to as DataProps)?.name, actions: item.id
    }))]
    const columns: ColumnsType<DataProps> = [
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
            filteredValue: [searchText],
            onFilter: (value, record) => (
                String(record.name)
                    .toLowerCase()
                    .includes((value as string).toLowerCase()) ||
                String(record.total_items)
                    .toLowerCase()
                    .includes((value as string).toLowerCase()) ||
                String(record.belongs_to)
                    .toLowerCase()
                    .includes((value as string).toLowerCase())
            ),
            render: (text) =>
                text.toString().toLowerCase().includes((searchText.toLowerCase())) ? (
                    <Highlighter
                        highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
                        searchWords={[searchText]}
                        autoEscape
                        textToHighlight={text ? text.toString() : ''}
                    />
                ) : (
                    text
                ),
        },
        {
            title: 'Group Parent',
            dataIndex: 'belongs_to',
            key: 'belongs_to',
            render: (text) =>
                text?.toString().toLowerCase().includes((searchText)) ? (
                    <Highlighter
                        highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
                        searchWords={[searchText]}
                        autoEscape
                        textToHighlight={text ? text.toString() : ''}
                    />
                ) : (
                    text
                ),
        },
        {
            title: 'Total Items',
            dataIndex: 'total_items',
            key: 'total_items',
            render: (text) =>
                text?.toString().toLowerCase().includes((searchText)) ? (
                    <Highlighter
                        highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
                        searchWords={[searchText]}
                        autoEscape
                        textToHighlight={text ? text.toString() : ''}
                    />
                ) : (
                    text
                ),
        },
        {
            title: 'Actions',
            dataIndex: 'actions',
            key: 'actions',
            render: (item) => <Space size={'middle'} direction='horizontal'>
                <EditOutlined style={{ fontSize: '13px', color: '#08c', cursor: 'pointer' }} onClick={() => { handleEdit(item) }} />
                <Popconfirm title={`Are you sure to delete group?`} onConfirm={() => handleDelete(item)} okText="Delete" cancelText="No"><DeleteOutlined style={{ fontSize: '13px', color: '#eb2f96', cursor: 'pointer' }} /></Popconfirm>
            </Space>

        }

    ];
    const handleDelete = async (id: number) => {
        const response = await axiosRequest({
            method: 'delete',
            url: `${groups_url}/${id}/`,
            hasAuth: true,
        })
        if (response) {
            getGroups(setGroups, setFetching)
            message.success("deleted group successfully")
        }
    }
    const handleEdit = (id: number) => {
        setShowModal(ModalEnum.edit)
        const groupEdit = groups.filter(item => item.id === id)
        if (groupEdit.length > 0) {
            form.setFieldsValue({ name: groupEdit[0].name, belongs_to_id: (groupEdit[0].belongs_to as DataProps).id, belongs_to_name: (groupEdit[0].belongs_to as DataProps).name, group_id: groupEdit[0].id })
        }

    }
    useGetGroups(setGroups, setFetching)

    const onGroupChange = () => {
        setShowModal(ModalEnum.off)
        setFetching(true)
        getGroups(setGroups, setFetching)
        form.resetFields()
    }
    return (<Fragment>
        <ContentLayout title='GROUPS' data={(dataSource as unknown) as DataProps[]} column={columns} searchInput={searchInput} buttonText={'Add group'} buttonClick={() => setShowModal(ModalEnum.add)} loading={fetching} />

        <AddGroup visible={showModal === ModalEnum.add} setClose={() => onGroupChange()} data={(groups as unknown) as DataProps[]} />

        <EditGroup visible={showModal === ModalEnum.edit} setClose={() => onGroupChange()} editForm={form} data={(groups as unknown) as DataProps[]} />

    </Fragment>
    )
}

export default Groups