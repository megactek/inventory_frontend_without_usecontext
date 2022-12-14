import { FC, useEffect, useState } from 'react'
import { DataProps } from '../../utils/types'
import { axiosRequest, formatCurrency } from '../../utils/functions'
import { purchases_url } from '../../utils/networks'



const Purchases: FC = () => {
    const [purchasesData, setPurchasesData] = useState<DataProps>()


    const getPurchasesData = async () => {
        const response = await axiosRequest<DataProps>({
            url: purchases_url,
            hasAuth: true,
        })
        if (response) {
            setPurchasesData(response.data)
            return

        }
    }

    useEffect(() => {
        getPurchasesData();
    }, [])
    return (
        <div className='card'>
            <h3>Purchases</h3>
            <div className="purchases">
                <div className="content">
                    <div className="title">{formatCurrency.format(purchasesData?.price as number)}</div>
                    <div className="info">(Price)</div>
                </div>
                <div className="content">
                    <div className="title">{String(purchasesData?.count)}</div>
                    <div className="info">(Count)</div>
                </div>
            </div>
        </div>
    )
}

export default Purchases
