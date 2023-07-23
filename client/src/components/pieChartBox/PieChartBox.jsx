import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';
import './pieChartBox.scss'

const data = [
    { name: 'Group A', value: 400, color: '#dc1ee0' },
    { name: 'Group B', value: 300, color: "#403feb" },
    { name: 'Group C', value: 300, color: "#a9f3ec" },
    { name: 'Group D', value: 200, color: "#d91110" }
];

export const PieChartBox = () => {
    return (
        <div className='pieChartBox'>
            <h1>Leads by Source</h1>

            <div className="chart">
                <ResponsiveContainer width="99%" height={300}>
                    <PieChart>
                        <Tooltip
                            contentStyle={{ background: 'white', borderRadius: '5px' }}
                        />
                        <Pie
                            data={data}
                            innerRadius={"70%"}
                            outerRadius={"90%"}
                            paddingAngle={5}
                            dataKey="value"
                        >
                            {data.map((item) => (
                                <Cell key={item.name} fill={item.color} />
                            ))}
                        </Pie>
                    </PieChart>
                </ResponsiveContainer>
            </div>

            <div className="options">
                {data.map((item) => (
                    <div className="option" key={item.name}>
                        <div className="title">
                            <div className="dot" style={{ background: item.color }} />
                            <span>{item.name}</span>
                        </div>
                        <span>{item.value}</span>
                    </div>
                ))}
            </div>
        </div>
    )
}
