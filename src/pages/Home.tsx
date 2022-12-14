import { FC, useEffect, useState } from 'react'
import Purchases from '../components/dashboard/Purchases'
import SalesByShop from '../components/dashboard/SalesByShop'
import SummaryData from '../components/dashboard/SummaryData'
import TopSelling from '../components/dashboard/TopSelling'

const Home: FC = () => {
    return (
        <div>

            <SummaryData />
            <br />
            <div className="dashboard-ui-st">
                <TopSelling />

                <div>
                    <SalesByShop />
                    <br />
                    <Purchases />
                </div>
            </div>

        </div>
    )
}

export default Home