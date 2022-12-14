import { useEffect } from "react"
import { authHandler, getGroups, getInventories, getMe, getShops, getUsers } from "./functions"
import { DataProps, GroupProps, hooksProps, UserType } from "./types"

export const useAuth = async ({ errorCallBack, successCallBack }: hooksProps) => {
    
    useEffect(() => {
        const checkUser = async () => {
            const user: UserType | null = await authHandler()
            if (!user) {
                errorCallBack()
                return
            }
            successCallBack()
        }
        checkUser()
    },[])
}

export const useGetGroups = (
    setGroups: (data: DataProps[]) => void,
    setFetching: (val: boolean) => void) => {
    useEffect(() => {
        getGroups(setGroups, setFetching)
    },[])
}
export const useGetUsers = async (setUsers: (values: DataProps[]) => void, setFetching: (val: boolean) => void)=> {
    useEffect(() => {
        getUsers(setUsers, setFetching)
    }, [])
    
}
export const useGetShops = (setShops: (values: DataProps[]) => void, setFetching: (val: boolean) => void) => {
    useEffect(() => {
        getShops(setShops, setFetching)
    },[])
}
export const useGetInventories = async (setInventories: (val: DataProps[]) => void, setFetching: (value: boolean) => void, pageNumber:number =1, setTotalPageNumber?:(val:number)=>void)=>{
    useEffect(() => {
    getInventories({setInventories, setFetching,pageNumber, setTotalPageNumber} )    
    },[])
}

export const useGetMe = async (setMe: (val: DataProps) => void, setFetching: (val: boolean) => void) => {
    useEffect(() => {
        getMe(setMe, setFetching)
    },[])
    
}