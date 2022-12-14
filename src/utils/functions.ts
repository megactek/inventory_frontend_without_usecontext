import { notification } from "antd"
import axios, {  AxiosResponse } from "axios"
import { tokenName } from "./data"
import { groups_url, inventory_url, me_url, profile_url, shops_url, users_url } from "./networks"
import { AuthTokenType, AxiosRequestProps, CustomAxiosError, DataProps, GroupProps, hooksProps, layoutHookProps, PageDataProps, UserType } from "./types"


export const getAuthToken = (): AuthTokenType|null => {
    const accessToken = localStorage.getItem(tokenName)
    if (!accessToken) {
        return null
    }
    return { Authorization: `Bearer ${accessToken}` }
}

export const axiosRequest = async <T>({
    method = 'get',
    url,
    hasAuth,
    payload,
    showError,
}: AxiosRequestProps): Promise<AxiosResponse<T>> => {
    const headers = hasAuth ? getAuthToken() : {}
    const response = await axios({
        method,
        url,
        data: payload,
        headers: { ...headers }, 
    }).catch((e: CustomAxiosError) => {
        showError && notification.error({
            message: e.response?.data.error
        })
    }) as AxiosResponse<T>
    return response
}
export const authHandler = async ():Promise<UserType|null> => { 
    const response = await axiosRequest<UserType>({
        url: me_url,
        hasAuth: true,
        showError: true,
    }) 
    if (response) {
        return response.data as UserType
    }
    return null
}
export const getGroups = async (setGroups:(data:DataProps[])=>void,setFetching:(val:boolean)=>void)=> {
    const response = await axiosRequest<{results:DataProps[]}>({
        url: groups_url,
        hasAuth: true,
        showError:true
    })
    if (response) {
        setGroups(response.data.results)
        setFetching(false)
        return
    }
    return 
}
export const getUsers = async (setUsers: (data: DataProps[]) => void, setFetching: (val: boolean) => void)=>{
    const response = await axiosRequest<DataProps[]>({
        url: users_url,
        hasAuth:true,
    })
    if (response) {
        setUsers(response.data)
        setFetching(false)
        return
    }
    return
}
export const getShops = async( setShops:(val:DataProps[])=>void,setFetching:(val:boolean)=>void) => {
    const response = await axiosRequest<{results: DataProps[]}>({
        url: shops_url,
        hasAuth:true,
        showError:true,
    })
    if (response) {
        setShops(response.data.results)
        setFetching(false)
        return
    }
    // return
}
export const getInventories = async (
    {
        setInventories,
        setFetching,
        pageNumber,
        query='',
        setTotalPageNumber
    }: layoutHookProps
) => {
    setFetching(true)
    const response = await axiosRequest<PageDataProps>({
        url:`${inventory_url}?page=${pageNumber}${query && `&keyword=${query}`}`,
        hasAuth: true,
    })
    if (response) {
        if (response.data.count > 20) {
            setTotalPageNumber && setTotalPageNumber(response.data.count)
        }
        setInventories(response.data.results)
    }
    setFetching(false)
    return
}
export const logout = () => {
    window.localStorage.removeItem(tokenName)
    window.location.href = "/login"
}
export const getTime = () => {
    const time = new Date()
    return `${time.getHours()} : ${time.getMinutes()}`
}
export const getDate = () => {
    const date = new Date()
    const month = date.getMonth()
    const day = date.getDate()
    return `${month}-${day}-${date.getFullYear()}`
  }
  

export const formatCurrency = new Intl.NumberFormat('en-Us', {
    currency: 'NGN',
    style: 'currency',
    minimumFractionDigits: 2,
    
    
})
export const getMe = async (setMe: (val: DataProps) => void, setFetching: (val: boolean) => void) => {
    setFetching(true)
        const response = await axiosRequest<DataProps>({
            url: profile_url,
            hasAuth: true
        })
        if (response) {
            setMe(response.data)
        }
        setFetching(false)
        return

}