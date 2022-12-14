import { FC, useEffect, useState } from 'react'
import { DataProps } from '../../utils/types'
import { axiosRequest } from '../../utils/functions'
import { sales_by_shop_url } from '../../utils/networks'

import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

const SalesByShop: FC = () => {

    const [data, setData] = useState<DataProps[]>([])

    const getData = async () => {
        const response = await axiosRequest<DataProps[]>({
            url: sales_by_shop_url,
            hasAuth: true,
        })
        if (response) {
            const data = response.data
            setData(data)
        }
    }

    useEffect(() => {
        getData()
    }, [])

    const getChartData = () => {
        const colorList = data.map(item => '#' + (Math.random() * 0xFFFFFF << 0).toString(16))
        return {
            labels: data.map(item => item.name),
            datasets: [
                {

                    data: data.map(item => item.amount_total),
                    backgroundColor: colorList,
                    borderColor: colorList,
                    borderWidth: 1
                }
            ]

        }
    }

    const pieOptions = {
        plugins: {
            legend: {
                display: true,
                labels: {
                    font: {
                        size: 12,
                    },
                },
            },
        },
    };
    return (
        <div className="card">
            <h3>Sales By Shop</h3>
            <div className="pieUI">
                <Pie data={getChartData()} options={pieOptions} />
            </div>
        </div>
    )
}

export default SalesByShop