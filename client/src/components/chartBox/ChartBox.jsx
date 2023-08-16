import { Link } from "react-router-dom";
import "./chartBox.scss";
import { LineChart, Line, Tooltip, ResponsiveContainer } from "recharts";
import PersonIcon from "@mui/icons-material/Person";
import ProductionQuantityLimitsIcon from "@mui/icons-material/ProductionQuantityLimits";
import AddReactionIcon from "@mui/icons-material/AddReaction";
import SmsIcon from "@mui/icons-material/Sms";

const ChartBox = (props) => {
  return (
    <div className="chartBox">
      <div className="boxInfo">
        <div className="title">
          <span>
            {props.icon === "users" ? (
              <PersonIcon />
            ) : props.icon === "product" ? (
              <ProductionQuantityLimitsIcon />
            ) : props.icon === "revenue" ? (
              <AddReactionIcon />
            ) : (
              <SmsIcon />
            )}
          </span>

          <span>{props.title}</span>
        </div>

        <h1>{props.getUsers.users.length}</h1>
        {/* <Link to="/">View all</Link> */}
      </div>

      <div className="chartInfo">
        {/* <div className="chart">
          <ResponsiveContainer width="99%" height="100%">
            <LineChart data={props.chartData}>
              <Tooltip
                contentStyle={{
                  background: "transparent",
                  border: "none",
                }}
                labelStyle={{ display: "none" }}
                position={{ x: 10, y: 70 }}
              />
              <Line
                type="monotone"
                dataKey={props.dataKey}
                stroke={props.color}
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div> */}

        {/* <div className="texts">
          <span
            className="percentage"
            style={{ color: props.percentage < 0 ? "tomato" : "limegreen" }}
          >
            {props.percentage}%
          </span>
          <span className="duration">this month</span>
        </div> */}
      </div>
    </div>
  );
};

export default ChartBox;
