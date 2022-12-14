import { Input } from 'antd'
import { ColumnsType } from 'antd/es/table'
import { FC, Fragment, useEffect, useState } from 'react'
import ContentLayout from '../components/ContentLayout'
import { axiosRequest } from '../utils/functions'
import { activities_url } from '../utils/networks'
import { DataProps } from '../utils/types'

const UserActivities: FC = () => {
    const [Loading, setLoading] = useState<boolean>(true)
    const [TotalPage, setTotalPage] = useState<number>(1)
    const [PageNumber, setPageNumber] = useState<number>(1)
    const [Activities, setActivities] = useState<DataProps[]>([])
    const [Query, setQuery] = useState('')


    const searchInput = (<Fragment>
        <Input.Search
            placeholder="input search text"
            autoFocus={true}
            onSearch={(value) => {
                setPageNumber(1)
                setQuery(value)

            }}
            style={{ width: 200, marginRight: 10 }}
            size="large"
            disabled={Loading ? true : false} />
    </Fragment>);


    const columns: ColumnsType<DataProps> = [

        {
            'title': 'Activity',
            'dataIndex': 'action',
            'key': 'action'
        },
        {
            'title': 'Staff Name',
            'dataIndex': 'staffName',
            'key': 'staffName'
        },

    ]
    const getActivities = async () => {
        setLoading(true)
        const response = await axiosRequest<{ results: DataProps[], count: number }>({
            url: `${activities_url}?page=${PageNumber}${Query ? `&keyword=${Query}` : ''}`,
            hasAuth: true,
        })
        if (response) {
            // console.log(response.data);
            setActivities(response.data.results)
            setTotalPage(response.data.count)

        }
        setLoading(false)
        return
    };
    const MapData = Activities.map((item, index) => ({
        key: index,
        staffName: item.fullname,
        action: item.action

    }))
    useEffect(() => {
        getActivities()
    }, [Query, PageNumber])
    return (
        <ContentLayout title={'User(s) Activities'} data={MapData} column={columns} showAdd={false} pageNumber={PageNumber} onPageChange={setPageNumber} totalPage={TotalPage} searchInput={searchInput} />
    )
}

export default UserActivities