import { Space } from 'antd'
import { FC, Fragment } from 'react'
import { formatCurrency, getDate, getTime } from '../utils/functions'
import { DataProps } from '../utils/types'

interface PrintProps {
    data: DataProps[]
}
const PrintOut: FC<PrintProps> = ({ data }) => {
    const stars = (<div style={{ display: 'flex', fontSize: '20px', fontWeight: 'bold' }}>
        {Array.from({ length: 30 }, (_, index) => <div key={index}>*</div>)}
    </div>)
    const MapData = data.map((item, index) => <Fragment>
        <div key={index} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '13px', marginBottom: '15px' }}>
            <div>
                {String(item.name)}  x  {String(item.qty)}
            </div>
            <div>
                {formatCurrency.format(Number(item.total))}
            </div>
        </div>
    </Fragment>)
    return (
        <div style={{ width: '250px' }}>
            {stars}
            <h3 style={{ textAlign: 'center' }}>Invoice</h3>
            {stars}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '11px', marginBottom: '5px' }}>
                <div>Terminal #1</div>
                <div>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        {getDate()}
                    </div>
                    <div>
                        {getTime()}
                    </div>
                </div>
            </div>
            <div>
                {
                    MapData
                }
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '15px', marginBottom: '10px', borderTop: '1px solid #c3c3c3', paddingTop: '20px' }}>
                <div>Total Amount</div>
                <div>{
                    formatCurrency.format(data.reduce((sum, item) => {
                        return sum += Number(item.total)
                    }, 0))
                }
                </div>
            </div>
        </div>
    )
}

export default PrintOut