import { ColumnsType } from 'antd/es/table'
import { FC, Fragment, useState } from 'react'
import AddUsers from '../components/AddUsers'
import ContentLayout from '../components/ContentLayout'
import { useGetShops, useGetUsers } from '../utils/hooks'
import { DataProps, ModalEnum } from '../utils/types'
import Highlighter from 'react-highlight-words';
import { Input } from 'antd'
import { getUsers } from '../utils/functions'
import moment from 'moment';

const Users: FC = () => {
    const [users, setUsers] = useState<DataProps[]>([])
    const [ModalState, setModalState] = useState<ModalEnum>(ModalEnum.off)
    const [fetching, setFetching] = useState<boolean>(false)
    const [Shops, setShops] = useState<DataProps[]>([])
    const [SearchText, setSearchText] = useState('')
    const columns: ColumnsType<DataProps> = [
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
            filteredValue: [SearchText],
            onFilter: (value, record) => (
                String(record.name)
                    .toLowerCase()
                    .includes((value as string).toLowerCase()) ||
                String(record.email)
                    .toLowerCase()
                    .includes((value as string).toLowerCase()) ||
                String(record.role)
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
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
            render: (text) =>
                String(text).toLowerCase().includes((SearchText)) ? (
                    <Highlighter
                        highlighterStyle={{ backgroundColor: '#ffc069', padding: 0 }}
                        searchWords={[SearchText]}
                        autoEscape
                        textToHighlight={text ? String(text) : ''}
                    />
                ) : (
                    text
                )
        },
        {
            title: 'Role',
            dataIndex: 'role',
            key: 'role',
            render: (text) => String(text).toLowerCase().includes((SearchText)) ? (
                <Highlighter
                    highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
                    autoEscape
                    searchWords={[SearchText]}
                    textToHighlight={text ? String(text) : ''}
                />) : (
                text
            )
        },
        {
            title: 'Last Login',
            dataIndex: 'last_login',
            key: 'last_login',
            render: (item) => item === null ? 'no logins yet' : moment(item).format('lll')
        },

    ];
    const dataSource: DataProps[] = users.map((user, index) => ({
        name: user.fullname, email: user.email, role: user.role, key: index, last_login: user.last_login,
    }))

    useGetUsers(setUsers, setFetching)
    useGetShops(setShops, () => null)
    const SearchInput = (<Input.Search placeholder='find users here' allowClear onSearch={(value) => setSearchText(value)} style={{ width: 200, marginRight: 10 }} size={'large'} onChange={(e) => setSearchText(e.target.value)} />)
    const onUserChange = () => {
        setModalState(ModalEnum.off)
        setFetching(true)
        getUsers(setUsers, setFetching)
    }
    return (
        <Fragment>
            <ContentLayout title='USERS' data={dataSource} column={columns} buttonText={'Add user'} buttonClick={() => setModalState(ModalEnum.add)} loading={fetching} searchInput={SearchInput} />

            <AddUsers visible={ModalState === ModalEnum.add} setClose={() => onUserChange()} data={Shops} />
        </Fragment>
    )
}

export default Users