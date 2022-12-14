import { FC, Fragment, useEffect } from 'react'
import { Button, Table } from 'antd';
import { ComponentProps } from '../utils/types';



const ContentLayout: FC<ComponentProps> =
    ({
        data,
        column,
        searchInput,
        buttonText,
        buttonClick = () => null,
        loading,
        extraButton,
        title,
        showAdd = true,
        pageNumber = 1,
        onPageChange = () => null,
        totalPage,
        inputRef,
        pagination = true
    }) => {
        useEffect(() => {
            inputRef && inputRef.current?.focus();
        }, [totalPage, inputRef])

        return <Fragment>
            <div className="cardHeader">
                <h1>{title}</h1>
                <div className="rightContent">
                    {searchInput}
                    {extraButton && extraButton}
                    {showAdd ? <Button onClick={() => buttonClick()} type="primary" style={{ marginRight: 0 }} size="large">
                        {buttonText}
                    </Button> : null}
                </div>
            </div>
            <Table columns={column} dataSource={data} scroll={{ x: 400 }} loading={loading} pagination={pagination ? ({
                pageSize: 10,
                total: totalPage,
                onChange: (page) => onPageChange(page)
            }) : (false)} />
        </Fragment>
    }

export default ContentLayout