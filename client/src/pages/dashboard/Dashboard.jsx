import './dashboard.scss'
import TopBox from "../../components/topBox/TopBox";
import ChartBox from "../../components/chartBox/ChartBox";
import { chartBoxUser, chartBoxProduct, chartBoxRevenue, chartBoxConversion, barChartBoxVisit, barChartBoxRevenue } from "../../data";
import BarChartBox from '../../components/barCharbox/BarChartBox';
import { PieChartBox } from '../../components/pieChartBox/PieChartBox';
import { BigChartBox } from '../../components/bigChartBox/BigChartBox';

const Dashboard = () => {
    return (
        <div className='dashboard'>
            <div className="box box1">
                <TopBox />
            </div>

            <div className="box box2">
                <ChartBox {...chartBoxUser} />
            </div>

            <div className="box box3">
                <ChartBox {...chartBoxProduct} />
            </div>

            <div className="box box4">
                <PieChartBox />
            </div>

            <div className="box box5">
                <ChartBox {...chartBoxConversion} />
            </div>

            <div className="box box6">
                <ChartBox {...chartBoxRevenue} />
            </div>

            <div className="box box7">
                <BigChartBox />
            </div>

            <div className="box box8">
                <BarChartBox {...barChartBoxVisit} />
            </div>

            <div className="box box9">
                <BarChartBox {...barChartBoxRevenue} />
            </div>
        </div>
    )
}

export default Dashboard