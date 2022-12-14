import { InboxOutlined } from '@ant-design/icons'
import { Form, message, Modal, notification, Progress, Upload } from 'antd'
import Dragger, { DraggerProps } from 'antd/es/upload/Dragger'
import axios, { AxiosRequestConfig } from 'axios'
import { FC, useState } from 'react'
import { axiosRequest, getAuthToken } from '../utils/functions'
import { inventory_csv_url } from '../utils/networks'
import { DataProps, ModalFormProps } from '../utils/types'


const AddInventoryCSV: FC<ModalFormProps> = ({ visible, setClose }) => {
    const [form] = Form.useForm()
    const [progress, setProgress] = useState<number>(0)
    const onSubmit = async () => {


    }
    const props: DraggerProps = {
        name: 'file',
        multiple: true,
        action: inventory_csv_url,
        beforeUpload: (file: File,) => {
            // message.error("CSV files only")

            return file.type === 'text/csv' || Upload.LIST_IGNORE
        },

        onChange(info) {

            const { status } = info.file;

            if (status !== 'uploading') {
            }
            if (status === 'done') {
                message.success(`${info.file.name} file uploaded successfully.`);
            } else if (status === 'error') {
                message.error(`${info.file.name} file upload failed.`);
            }
        },
        customRequest: async ({ action, file, onProgress, onSuccess, onError }) => {
            const headers = getAuthToken()
            const config: AxiosRequestConfig = {
                headers: { ...headers },
                onUploadProgress(event) {
                    const percent = Math.floor((event.loaded / Number(event.total?.toString())) * 100)
                    setProgress(percent)
                    if (percent == 100) {
                        setTimeout(() => setProgress(0), 1500)
                    }
                    // onProgress && onProgress({ percent: (event.loaded / Number(event.total?.toString())) * 100 })
                }
            }
            const fmData = new FormData()
            fmData.append('data', file)
            const response = await axios.post(action, fmData, config)
                .catch((err) => {
                    notification.error(err)
                    onError && onError(err)
                    throw new Error(err)
                })

            if (response) {
                onSuccess && onSuccess("Ok")
                // message.success("item loaded")
                form.resetFields()
                setClose()
            }

            return
        },
        onDrop(e) {
            console.log('Dropped files', e.dataTransfer.files);
        },


    };
    return (
        <Modal open={visible} onCancel={setClose} title={'Add inventory with csv file'} maskClosable={false} onOk={() => form.submit()}>
            <Form layout='vertical'
                autoComplete='off'
                onFinish={onSubmit}
                form={form} style={{ marginTop: '30px' }}>
                <Form.Item
                    rules={[{
                        required: true,
                        message: 'please select a CSV* file'
                    }]}>
                    <Dragger {...props}>
                        <p className="ant-upload-drag-icon">
                            <InboxOutlined />
                        </p>
                        <p className="ant-upload-text">Click or drag file to this area to upload</p>

                        <p className="ant-upload-hint">
                            Support for a single or bulk upload. Strictly prohibit from uploading company data or other
                            band files
                        </p>
                    </Dragger>
                    {progress > 0 ? <Progress percent={progress} /> : null}
                    <p></p>

                </Form.Item>
            </Form>
        </Modal>
    )
}

export default AddInventoryCSV