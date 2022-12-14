import { Spin } from 'antd';
import { FC, ReactElement, useEffect, useState } from 'react'
import { axiosRequest } from '../../utils/functions';
import { top_selling_url } from '../../utils/networks';
import { DataProps } from '../../utils/types';


interface TopSellingProps {
    [key: string]: {
        title: string
        count: number
        icon: ReactElement
    }
}


const TopSelling: FC = () => {
    const [data, setData] = useState<DataProps[]>([])
    const [loading, setLoading] = useState(true);

    const getTopSell = async () => {

        const response = await axiosRequest<DataProps[]>({
            method: 'get',
            url: top_selling_url,
            hasAuth: true,
            showError: true
        })
        if (response) {
            const data = response.data.map((item) => ({
                ...item, groupInfo: (item.group as DataProps).name,
                photosInfo: item.photo
            }))
            setData(data)
        }

        setLoading(false)

    }

    useEffect(() => {
        getTopSell()
    }, [])
    return (
        <div className="card topSellContainer">
            {
                loading ? <Spin /> :
                    data.map((item, index) => <div key={index} className="topSellingItem">
                        <div className="imageCon">
                            <img src={String(item.photo)} alt="" />
                        </div>

                        <h3>{String(item.name).slice(0, 20)}</h3>
                        <p><span>Total Sold: &nbsp;</span>{Number(item.sum_of_items)}</p>
                    </div>)
            }
        </div>
    )
}

export default TopSelling