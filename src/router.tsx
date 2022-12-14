import { FC } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import AuthRoute from './components/AuthRoute'
import Account from './pages/Account'
import CheckUser from './pages/CheckUser'
import Groups from './pages/Groups'
import Home from './pages/Home'
import Inventories from './pages/Inventories'
import InvoiceCreations from './pages/InvoiceCreations'
import Invoices from './pages/Invoices'
import Login from './pages/Login'
import Shops from './pages/Shops'
import UserActivities from './pages/UserActivities'
import Users from './pages/Users'

const Router: FC = () => {
    return <BrowserRouter>
        <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/dashboard" element={<AuthRoute><Home /></AuthRoute>} />
            <Route path="/groups" element={<AuthRoute><Groups /></AuthRoute>} />
            <Route path="/shops" element={<AuthRoute><Shops /></AuthRoute>} />
            <Route path="/users" element={<AuthRoute><Users /></AuthRoute>} />
            <Route path="/invoice" element={<AuthRoute><Invoices /></AuthRoute>} />
            <Route path="/invoice_creation" element={<AuthRoute><InvoiceCreations /></AuthRoute>} />
            <Route path="/inventory" element={<AuthRoute><Inventories /></AuthRoute>} />
            <Route path="/user_activities" element={<AuthRoute><UserActivities /></AuthRoute>} />
            <Route path="/me" element={<AuthRoute><Account /></AuthRoute>} />
            <Route path="/check_user" element={<CheckUser />} />
        </Routes>
    </BrowserRouter>
}
export default Router