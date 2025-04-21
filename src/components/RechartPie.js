/* eslint-disable no-shadow */
import { PieChart, Pie, Cell } from 'recharts';

export default function Sample({ accidents }) {

  let totalCount = 0;

  accidents.forEach(accident => {
    totalCount += accident.occrrnc_cnt;
  })

  const RADIAN = Math.PI / 180;
  const data = [
    { name: 'D', value: 45, color: 'lightgreen' },
    { name: 'C', value: 45, color: 'gold' },
    { name: 'B', value: 45, color: 'orange' },
    { name: 'A', value: 45, color: 'orangered' },
  ];
  const cx = 150;
  const cy = 200;
  const iR = 50;
  const oR = 100;
  // const value = 90;
  const value = totalCount > 19 ? 180 : totalCount * 10;

  const needle = (value, data, cx, cy, iR, oR, color) => {
    let total = 0;
    data.forEach((v) => {
      total += v.value;
    });
    const ang = 180.0 * (1 - value / total);
    const length = (iR + 2 * oR) / 3;
    const sin = Math.sin(-RADIAN * ang);
    const cos = Math.cos(-RADIAN * ang);
    const r = 5;
    const x0 = cx + 5;
    const y0 = cy + 5;
    const xba = x0 + r * sin;
    const yba = y0 - r * cos;
    const xbb = x0 - r * sin;
    const ybb = y0 + r * cos;
    const xp = x0 + length * cos;
    const yp = y0 + length * sin;

    return [
      <circle cx={x0} cy={y0} r={r} fill={color} stroke="none" />,
      <path d={`M${xba} ${yba}L${xbb} ${ybb} L${xp} ${yp} L${xba} ${yba}`} stroke="#none" fill={color} />,
    ];
  };

  return (
    <div>
      <h3 className="text-lg text-gray-500 font-bold text-center mt-4">
        총 {totalCount}건의 사고 발생
      </h3>
      <PieChart width={300} height={250}>
        <Pie
          dataKey="value"
          startAngle={180}
          endAngle={0}
          data={data}
          cx={cx}
          cy={cy}
          innerRadius={iR}
          outerRadius={oR}
          fill="#8884d8"
          stroke="none"
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Pie>
        {needle(value, data, cx, cy, iR, oR, '#ddd')}
      </PieChart>

      <ul className="px-4">
        <li className="my-2 font-bold text-green-400">주의 (NOTICE)</li>
        <li className="my-2 font-bold text-yellow-400">경계 (CAUTION)</li>
        <li className="my-2 font-bold text-orange-400">경고 (WARNING)</li>
        <li className="my-2 font-bold text-red-400">위험 (DANGER)</li>
      </ul>
    </div>
  );
}
