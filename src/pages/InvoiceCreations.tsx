import { ColumnsType } from 'antd/es/table'
import { createRef, FC, Fragment, LegacyRef, useEffect, useRef, useState } from 'react'
import ContentLayout from '../components/ContentLayout'
import { getInventories, getDate, formatCurrency, axiosRequest } from '../utils/functions'
import { useGetInventories } from '../utils/hooks'
import Highlighter from 'react-highlight-words';
import { DataProps } from '../utils/types'
import { Avatar, Button, Col, Input, InputNumber, message, Modal, notification, Popconfirm, Row, Space, Tooltip } from 'antd'
import { CodeOutlined, FileExcelOutlined, MinusCircleOutlined, } from '@ant-design/icons'

import PrintOut from '../components/PrintOut'
import { useReactToPrint } from 'react-to-print'
import { invoice_url } from '../utils/networks'

const InvoiceCreations: FC = () => {
    const [Inventories, setInventories] = useState<DataProps[]>([])
    const [Fetching, setFetching] = useState<boolean>(false)
    const [InvoiceData, setInvoiceData] = useState<DataProps[]>([])
    const [query, setQuery] = useState('')
    const [pageNumber, setPageNumber] = useState<number>(1)
    const [TotalPage, setTotalPageNumber] = useState<number>(1)
    const [InvoiceLoading, setInvoiceLoading] = useState(false);
    const [CanPrint, setCanPrint] = useState(false)
    const PrintRef: LegacyRef<HTMLDivElement> = useRef<HTMLDivElement>(null)


    const searchInput = (<Fragment>
        <Input.Search
            placeholder="input search text"
            autoFocus={true}
            onSearch={(value) => handleSearch(value)}
            style={{ width: 200, marginRight: 10 }}
            size="large"
            // onChange={(e) => setQuery(e.target.value)}
            disabled={Fetching ? true : false} />
    </Fragment>);

    const clearButton = (<Fragment>
        <Popconfirm
            placement='bottom'
            title={'clear items from invoice'} okText={'clear'} onConfirm={() => setInvoiceData([])}>
            <Button
                size='small'
                danger
                style={{ marginLeft: '50px' }}
                icon={<CodeOutlined />}
            >
                clear invoice
            </Button>
        </Popconfirm>
    </Fragment>);

    const invoiceColumns: ColumnsType<DataProps> = [
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name'
        },
        {
            title: 'Qty',
            dataIndex: 'qty',
            key: 'qty'
        },
        {
            title: 'Price',
            dataIndex: 'price',
            key: 'price'
        },
        {
            title: 'Total',
            dataIndex: 'total',
            key: 'total'
        },
        {
            title: 'Action',
            dataIndex: 'action',
            key: 'action',
            render: (item) => (<Space>
                <Tooltip
                    placement='top'
                    title={'remove item from invoice'} >
                    <MinusCircleOutlined
                        style={{ fontSize: '15px', cursor: 'pointer', color: '#ff4d4f', fontWeight: 'bolder' }}
                        label={'add to cart'}
                        onClick={() => handleRemove(item)}
                    />
                </Tooltip>
            </Space>)
        }
    ];

    const columns: ColumnsType<DataProps> = [
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
            width: '30%',
            filteredValue: [query],
            onFilter: (value, record) => (
                String(record.name)
                    .toLowerCase()
                    .includes((value as string).toLowerCase()) ||
                String(record.group_name)
                    .toLowerCase()
                    .includes((value as string).toLowerCase()) ||
                String(record.code)
                    .toLowerCase()
                    .includes((value as string).toLowerCase())
            ),
            render: (item) =>
                String(item).toLowerCase().includes((query)) ? (
                    <Highlighter
                        highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
                        searchWords={[query]}
                        autoEscape
                        textToHighlight={item ? item.toString() : ''}
                    />
                ) : (
                    item
                ),

        },
        // {
        //     title: 'Code',
        //     dataIndex: 'code',
        //     key: 'code',
        //     width: '5%',
        // },
        {
            title: 'Image',
            dataIndex: 'photo',
            key: 'photo',
            render: (item) => <Avatar shape="square" size={40} icon={item === null ? <FileExcelOutlined /> : ""} src={item} />

        },
        {
            title: 'Group',
            dataIndex: 'group_name',
            key: 'group_name',
            render: (item) =>
                item.toString().toLowerCase().includes((query)) ? (
                    <Highlighter
                        highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
                        searchWords={[query]}
                        autoEscape
                        textToHighlight={item ? item.toString() : ''}
                    />
                ) : (
                    item
                )

        },
        {
            title: 'Total',
            dataIndex: 'total',
            key: 'total',

        },
        {
            title: 'Remaining',
            dataIndex: 'remaining',
            key: 'remaining',

        },
        {
            title: 'Price',
            dataIndex: 'price',
            key: 'price',

        },
        {
            title: 'Action',
            dataIndex: 'action',
            key: 'action',
            render: (item) => (<Space direction={'horizontal'} size={'small'}>
                <Tooltip title="add item(s) to invoice" >
                    <InputNumber defaultValue={0} max={item.remaining} style={{ maxWidth: '70px', }} onChange={(e) => handleAddItem(item, e)} min={0} />
                </Tooltip>
            </Space>),
            width: '5%',

        },
    ];
    const invoiceDataItems: DataProps[] = InvoiceData.map((item, index) => ({
        key: index,
        name: item.name?.toString().slice(0, 20),
        total: item.total,
        price: item.price,
        qty: item.qty,
        remaining: item.remaining,
        action: item

    }));

    const data: DataProps[] = Inventories.map((item, index) => {
        if (Number(item.remaining) > 0) {
            return ({
                key: index,
                name: item.name,
                code: item.code,
                total: item.total,
                remaining: item.remaining,
                group_name: (item.group as DataProps).name,
                photo: item.photo,
                price: formatCurrency.format(Number(item.price)),
                action: item
            })
        }
        return {}
    });

    const handleAddItem = (item: DataProps, qty: number) => {
        setInvoiceLoading(true)
        if (qty <= 0) {
            setInvoiceLoading(false)
            return false
        }
        let _tempInvoiceData: DataProps[]
        const existingData = [...InvoiceData]
        const checkItem = InvoiceData.filter(it => it.id === item.id)


        if (checkItem.length >= 1) {
            _tempInvoiceData = InvoiceData.map(invt => {
                if (invt.id == item.id) {
                    return ({
                        id: invt.id,
                        name: invt.name,
                        price: invt.price,
                        qty: qty,
                        total: Number(item.price) * qty,
                        action: item
                    })
                }
                return invt
            })
        } else {
            const itemToInsert: DataProps = {
                id: item.id,
                name: item.name,
                price: item.price,
                qty: qty,
                total: Number(item.price) * qty,
                action: item

            }
            _tempInvoiceData = [...existingData, itemToInsert]

        }
        _tempInvoiceData.sort((a, b) => {
            const c = a.name ? a.name : 0;
            const d = b.name ? b.name : 0;
            if (c < d) return -1
            if (d > c) return 1
            return 0
        })

        setInvoiceData([..._tempInvoiceData])
        setInvoiceLoading(false)
    };

    const handleRemove = (item: DataProps) => {
        console.log(item);
        setInvoiceLoading(true)
        const filtered = InvoiceData.filter(it => it.id !== item.id)
        setInvoiceData([...filtered])
        message.success(`${item.name} removed  from cart`)
        setInvoiceLoading(false)
        return true
    };
    const handleSubmit = async () => {
        if (InvoiceData.length < 1) {
            message.error(
                'No item in cart...'
            )
            return false
        }
        setInvoiceLoading(true)
        const sendPayload = {
            invoice_item_data: InvoiceData.map(item => ({
                item_id: item.id,
                quantity: item.qty,
            }))
        }
        const response = await axiosRequest({
            method: 'post',
            url: invoice_url,
            hasAuth: true,
            showError: true,
            payload: sendPayload
        })
        if (response) {
            notification.success({
                message: 'Invoice Created',
            })
        }
        getInventories({ setInventories, setFetching, pageNumber, setTotalPageNumber })
        setInvoiceLoading(false)
        setCanPrint(true)
        return
    }

    const Print = useReactToPrint({
        content: () => PrintRef.current
    })

    useGetInventories(
        setInventories,
        setFetching,
        pageNumber,
        setTotalPageNumber,
    );

    useEffect(() => {
        if (CanPrint) {
            Print()
            setInvoiceData([])
            setCanPrint(false)
        }
        getInventories({ setInventories, setFetching, pageNumber, setTotalPageNumber })
    }, [pageNumber, CanPrint])


    const handleSearch = (val: string) => {
        setFetching(true)
        getInventories({ setInventories, setFetching, pageNumber, setTotalPageNumber, query: val, })
    }


    return (
        <Fragment>
            <Row>
                <Col span={16}>
                    <ContentLayout title={'INVENTORY'} data={data} column={columns} buttonText={'add inventory'} loading={Fetching} searchInput={searchInput} showAdd={false} pageNumber={pageNumber} onPageChange={setPageNumber} totalPage={TotalPage} />
                </Col>
                <Col span={8} style={{ paddingTop: '15px', paddingLeft: '3px', maxHeight: '960px', overflow: 'scroll' }}>
                    <ContentLayout title={'Invoice'} data={invoiceDataItems.sort()} column={invoiceColumns} loading={InvoiceLoading} showAdd={false} searchInput={clearButton} pagination={false} />
                    <div className='brief'>
                        <p>
                            Date: {getDate()}
                        </p>
                        <p>
                            Total Price: {formatCurrency.format(InvoiceData.reduce((sum, item) => {
                                return sum += Number(item.total)
                            }, 0))}
                        </p>
                    </div>
                    <div className='invoice-footer'>
                        <Button type={'primary'} size={'middle'} onClick={handleSubmit}>Save &amp; Print</Button>
                    </div>
                </Col>

            </Row>
            {<div ref={PrintRef} >
                {CanPrint && <PrintOut data={InvoiceData} />}
            </div>}
        </Fragment >


    )
}

export default InvoiceCreations