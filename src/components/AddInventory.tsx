import { useState, FC } from 'react';
import { Form, Input, message, Modal, Progress, Select } from 'antd';
import ImgCrop from 'antd-img-crop';
import type { UploadFile, UploadProps } from 'antd/es/upload/interface';
import { DataProps, GroupProps, ModalFormProps } from '../utils/types';
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import type { UploadChangeParam } from 'antd/es/upload';
import { cloudinary_url, inventory_url } from '../utils/networks';
import axios, { AxiosRequestConfig } from 'axios';
import { Upload } from 'antd'
import { useGetGroups } from '../utils/hooks';
import { axiosRequest } from '../utils/functions';

const { Option } = Select
const beforeUpload = async (file: File) => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
        message.error('You can only upload JPG/PNG file!');

    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
        message.error('Image must smaller than 2MB!');
    }
    return isJpgOrPng && isLt2M || Upload.LIST_IGNORE;
};
const AddInventory: FC<ModalFormProps> = ({ visible, setClose }) => {
    const [form] = Form.useForm()
    const [loading, setLoading] = useState(false);
    const [progress, setProgress] = useState<number>(0)
    const [ImageUrl, setImageUrl] = useState('')
    const [Groups, setGroups] = useState<DataProps[]>([])
    const [FileList, setFileList] = useState<UploadFile[]>([])

    const uploadButton = (
        <div>
            {loading ? <LoadingOutlined /> : <PlusOutlined />}
            <div style={{ marginTop: 8 }}>inventory image</div>
        </div>
    );

    const handleOnChange = ({ fileList }: UploadChangeParam) => {
        setFileList(fileList)
    }

    const upProps: UploadProps = {
        beforeUpload: beforeUpload,
        action: cloudinary_url,
        listType: 'picture-card',
        className: 'avatar-uploader',
        customRequest: async ({ onProgress, file, action, onSuccess, onError }) => {
            const fmData = new FormData();
            const config: AxiosRequestConfig = {
                headers: {
                    'Content-Type': 'multipart/form-data'
                },
                onUploadProgress(event) {
                    const percent = Math.floor((event.loaded / Number(event.total?.toString())) * 100)
                    setProgress(percent)
                    if (percent === 100) {
                        setTimeout(() => setProgress(0), 1500)
                    }
                    onProgress && onProgress({ percent: (event.loaded / Number(event.total?.toString())) * 100 })
                },

            }
            fmData.append('upload_preset', 'inventory_app')
            fmData.append('tag', 'inventory_app')
            fmData.append('file', file)
            const response = await axios.post(action, fmData, config)
                .catch((err) => onError && onError(err))
            if (response) {
                setImageUrl(response.data.url)
                message.success("Image uploaded")
                onSuccess && onSuccess("Ok")
            }

        },
        defaultFileList: FileList,
        onChange: handleOnChange,
    }

    useGetGroups(setGroups, () => null)

    const handleSubmit = async (values: DataProps) => {
        setLoading(true)
        const payload = { ...values, photo: ImageUrl }
        const response = await axiosRequest({
            url: inventory_url,
            method: 'post',
            hasAuth: true,
            payload: payload,
            showError: true
        })
        if (response) {
            message.success('item uploaded')
        }

        form.resetFields()
        setTimeout(() => {
            setClose()
            setLoading(false)
        }, 1000)

    }

    return (
        <Modal
            title="Add inventory item"
            maskClosable={false}
            okText='add'
            onOk={() => form.submit()}
            open={visible}
            onCancel={() => setClose()}
            confirmLoading={loading}
        >
            <Form form={form} layout='vertical' onFinish={handleSubmit} autoComplete={'off'}>
                <Form.Item required={false}>
                    <ImgCrop rotate>
                        <Upload {...upProps}>
                            {FileList.length >= 1 ? null : uploadButton}
                        </Upload>
                    </ImgCrop>
                    {progress > 0 ? <Progress percent={progress} /> : null}
                </Form.Item>
                <Form.Item
                    label="Name"
                    name='name'
                    rules={[{ required: true, message: 'please enter item name' }]}
                >
                    <Input placeholder="Enter Item Name" type='text' />
                </Form.Item>
                <Form.Item
                    label="Count"
                    name='total'
                    rules={[{ required: true, message: 'please enter a count value' }]}
                >
                    <Input placeholder="Enter Item Count" type='number' min={1} />
                </Form.Item>
                <Form.Item
                    label="Item Price ($)"
                    name='price'
                    rules={[{ required: true, message: 'please enter item price' }]}
                >
                    <Input placeholder="Enter Item Price" type='number'
                        min={1} />
                </Form.Item>

                <Form.Item
                    label="Group/Category"
                    name='group_id'
                    rules={[{ required: true, message: 'Please select a group' }]}
                >
                    <Select defaultValue={() => ""}>
                        {
                            Groups?.map((item, index) => <Option value={item.id} key={index} >{String(item.name)}</Option>)
                        }
                    </Select>
                </Form.Item>

            </Form>
        </Modal >
    )
}

export default AddInventory