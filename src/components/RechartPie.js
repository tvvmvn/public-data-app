import { useState } from 'react';
import { PieChart, Pie, Sector, ResponsiveContainer } from 'recharts';

export default function RechartPie({ accidents, fill }) {
  const [activeIndex, setActiveIndex] = useState(0);

  /* 
    공공데이터 API가 지역구에서 발생한 총 사고 건수 자료를 제공하고 있지 않기 때문에
    필요한 경우 아래와 같이 프론트엔드 개발자가 데이터를 가공하여 원하는 데이터를 구성할 수 있다
  */

  let totalCount = 0;
  let deathCount = 0;
  let woundCount = 0;
  let injuredCount = 0;
  let casualtiesCount = 0;

  accidents.forEach(accident => {
    totalCount += accident.occrrnc_cnt;
    casualtiesCount += accident.caslt_cnt;
    deathCount += accident.dth_dnv_cnt;
    woundCount += accident.se_dnv_cnt;
    injuredCount += accident.sl_dnv_cnt;
  })

  const data = [
    { name: "중상", value: woundCount },
    { name: "경상", value: injuredCount },
    { name: "사망", value: deathCount },
  ];

  return (
    <div className="w-1/2 flex flex-col h-full">
      <h3 className="text-xl text-center">총 {totalCount}건의 사고 발생</h3>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart width={400} height={400}>
          <Pie
            activeIndex={activeIndex}
            activeShape={renderActiveShape}
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={80}
            fill={fill}
            dataKey="value"
            onMouseEnter={(_, index) => setActiveIndex(index)}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

function renderActiveShape(props) {
  const RADIAN = Math.PI / 180;
  const { 
    cx, cy, 
    midAngle, 
    innerRadius, outerRadius, 
    startAngle, endAngle, 
    fill, 
    payload, 
    percent, 
    value 
  } = props;
  const sin = Math.sin(-RADIAN * midAngle);
  const cos = Math.cos(-RADIAN * midAngle);
  const sx = cx + (outerRadius + 10) * cos;
  const sy = cy + (outerRadius + 10) * sin;
  const mx = cx + (outerRadius + 30) * cos;
  const my = cy + (outerRadius + 30) * sin;
  const ex = mx + (cos >= 0 ? 1 : -1) * 22;
  const ey = my;
  const textAnchor = cos >= 0 ? 'start' : 'end';

  return (
    <g>
      <text x={cx} y={cy} dy={8} textAnchor="middle" fill={fill}>
        {payload.name}
      </text>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
      />
      <Sector
        cx={cx}
        cy={cy}
        startAngle={startAngle}
        endAngle={endAngle}
        innerRadius={outerRadius + 6}
        outerRadius={outerRadius + 10}
        fill={fill}
      />
      <path 
        d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`} stroke={fill} fill="none" />
      <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" />
      <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} textAnchor={textAnchor} fill="#333">
        {value + "건"}
      </text>
      <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} dy={18} textAnchor={textAnchor} fill="#999">
        {(percent * 100).toFixed(2) + "%"}
      </text>
    </g>
  );
};