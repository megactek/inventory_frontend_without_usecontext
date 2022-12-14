import { Spin } from 'antd';
import { FC, ReactElement, useEffect, useState } from 'react'
import { Group, Inventory, Shop, UserGroup } from '../../assets/svgs/svgs';
import { axiosRequest } from '../../utils/functions';
import { summary_url } from '../../utils/networks';
import { DataProps } from '../../utils/types';
interface SummaryDataProps {
    [key: string]: {
        title: string
        count: number
        icon: ReactElement
    }
}

const tempSummary: SummaryDataProps = {
    "total_inventory": {
        title: 'Total Items',
        count: 25,
        icon: <span className='dashIcon inventory'><Inventory /></span>
    },
    "total_groups": {
        title: 'Total Groups',
        count: 25,
        icon: <span className='dashIcon groups'><Group /></span>
    },
    "total_shops": {
        title: 'Total Shops',
        count: 25,
        icon: <span className='dashIcon shops'><Shop /></span>
    },
    "total_user": {
        title: 'Total Users',
        count: 25,
        icon: <span className='dashIcon users'><UserGroup /></span>
    }
}

const SummaryData: FC = () => {
    const [summaryData, setSummaryData] = useState(tempSummary);
    const [loading, setLoading] = useState(false);

    const getSummaryData = async () => {
        setLoading(true)
        const response = await axiosRequest({
            method: 'get',
            url: summary_url,
            hasAuth: true,
            showError: true
        })
        if (response) {
            setLoading(false)

            const result = response.data as { [key: string]: number }
            const _tempData = {
                ...summaryData

            }

            Object.keys(result).map(item => {
                _tempData[item].count = result[item]
                return true
            })
            setSummaryData(_tempData)
        }
        setLoading(false)
    }

    useEffect(() => {
        getSummaryData()
    }, [])
    return (
        <div className="summaryContainer">
            {
                Object.values(summaryData).map((item, index) => <div key={index} className='summaryContent card'>
                    <div className="info">
                        <div className="title">{(item?.title)}</div>
                        <div className="count">{loading ? <Spin></Spin> : item.count}</div>
                    </div>
                    <div className="icon">
                        {item.icon}
                    </div>
                </div>
                )
            }
        </div>
    )
}

export default SummaryData