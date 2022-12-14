import { FormInstance, InputRef } from "antd";
import { ColumnsType } from "antd/es/table";
import { AxiosError } from "axios"
import React, { ReactNode, Ref, RefObject } from "react";

export interface DataProps {
    [keys: string]: string | number | DataProps | DataProps[] |undefined|ReactNode|DataProps;
}
export interface AuthComponentProps {
    titleText?: string
    isPassword?: boolean
    buttonText?: string
    linkText?: string
    linkPath?: string
    onSubmit: (val: DataProps) => void
    loading: boolean
    isPasswordCreate?:boolean
}

export interface CustomAxiosError extends Omit<AxiosError, 'response'> {
    response?: {
        data: {
            error: string
        }
    }

}

export interface AuthTokenType {
    Authorization: string;
}

export interface UserType {
    email: string;
    fullname: string;
    id: number;
    role: string;
    last_login: string;

}
export interface AxiosRequestProps {
    method?: 'get' | 'post' | 'patch' | 'delete';
    url: string;
    payload?: DataProps | DataProps[];
    hasAuth?: boolean;
    showError?: boolean;

}
export interface hooksProps {
    successCallBack: () => void;
    errorCallBack: () => void;
}
export interface GroupProps {
    key: React.Key
    belongs_to: DataProps | null;
    name:string
    total_items: string
    id:number
}
export interface ComponentProps {
    title: string;
    data: DataProps[];
    loading?: boolean;
    column: ColumnsType<DataProps>;
    searchInput?: React.ReactElement;
    buttonText?: string;
    extraButton?: React.ReactElement;
    buttonClick?: () => void;
    showAdd?: boolean;
    pageNumber?: number;
    totalPage?: number;
    onPageChange?: (val: number) => void;
    inputRef?: RefObject<InputRef>;
    pagination?: boolean;

}
export interface ModalFormProps {
    visible: boolean;
    setClose: () => void
    data?: DataProps[];
    editForm?: FormInstance;
}
export enum ModalEnum {
    add,edit,off,csv
}
export interface PageDataProps {
    count: number | 1,
    results: DataProps[]
}
export interface layoutHookProps {
    setInventories: (value: DataProps[]) => void,
    setFetching: (val: boolean) => void,
    pageNumber?: number,
    query?: string,
    setTotalPageNumber?: (val: number) => void
}