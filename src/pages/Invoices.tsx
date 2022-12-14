import { PrinterOutlined, PrinterTwoTone } from '@ant-design/icons'
import { Input, Space, Tooltip } from 'antd'
import { ColumnsType } from 'antd/es/table'
import { FC, Fragment, LegacyRef, useEffect, useRef, useState } from 'react'
import { useReactToPrint } from 'react-to-print'
import ContentLayout from '../components/ContentLayout'
import PrintOut from '../components/PrintOut'
import { axiosRequest } from '../utils/functions'
import { invoice_url } from '../utils/networks'
import { DataProps } from '../utils/types'


const Invoices: FC = () => {
    const [Invoices, setInvoices] = useState<DataProps[]>([])
    const [Loading, setLoading] = useState(true)
    const PrintRef: LegacyRef<HTMLDivElement> = useRef<HTMLDivElement>(null)
    const [CanPrint, setCanPrint] = useState(false)
    const [InvoiceData, setInvoiceData] = useState<DataProps[]>([])
    const [PageCount, setPageCount] = useState<number>(1)
    const [pageNumber, setPageNumber] = useState<number>(1)
    const [Query, setQuery] = useState<string>()

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

    const getInvoices = async () => {
        setLoading(true)
        const response = await axiosRequest<{ results: DataProps[], count: number }>({
            url: `${invoice_url}?page=${pageNumber}${Query ? `&keyword=${Query}` : ''}`,
            hasAuth: true
        })
        if (response) {
            setPageCount(response.data.count)
            setInvoices(response.data.results)
            setLoading(false)
        }
        setLoading(false)
        return
    }

    const columns: ColumnsType<DataProps> = [
        {
            title: 'Sold by',
            dataIndex: 'created_by',
            key: 'created_by'
        },
        {
            title: 'Shop',
            dataIndex: 'shop_name',
            key: 'shop_name'
        },
        {
            title: 'Item(s) Sold',
            dataIndex: 'count',
            key: 'count'
        },
        {
            title: 'Action',
            dataIndex: 'action',
            key: 'action',
            render: (item) =>
                <Space>
                    <Tooltip title={'print invoice'}> <PrinterTwoTone style={{ fontSize: '20px', color: '#08c', cursor: 'pointer' }} onClick={() => handleClick(item)} /></Tooltip>
                </Space>
        },


    ];
    const data = Invoices.map((item, index) => ({
        key: index,
        created_by: (item.created_by as DataProps).fullname,
        shop_name: item.shop == null ? "No Shop" : (item.shop as DataProps).name,
        count: (item.invoice_items as Array<DataProps>).length,
        action: item.invoice_items,
    }))

    const printInvoice = useReactToPrint({
        content: () => PrintRef.current
    })
    const handleClick = (items: DataProps[]) => {
        setInvoiceData(items)
        setCanPrint(true)
    }
    const mapData = InvoiceData.map((item, index) => ({
        key: index,
        name: (item.item as DataProps).name,
        qty: item.quantity,
        total: item.amount
    }))
    useEffect(() => {
        getInvoices()
        if (CanPrint) {
            printInvoice()
            setInvoiceData([])
            setCanPrint(false)
        }
    }, [CanPrint, Query])
    return (
        <div className='invoice-card'>
            <ContentLayout title={'Sale(s) invoice'} data={data} column={columns} loading={Loading} showAdd={false} totalPage={PageCount} onPageChange={setPageNumber} pageNumber={pageNumber} searchInput={searchInput} />

            {<div ref={PrintRef} >
                {CanPrint && <PrintOut data={mapData} />}
            </div>}
        </div>
    )
}

export default Invoices