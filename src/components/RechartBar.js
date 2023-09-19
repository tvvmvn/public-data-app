import {
  ComposedChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

export default function RechartBar({ accidents }) {

  /*
    아래의 data 변수는 
    리차트 라이브러리가 요구하는 형식으로 기존의 데이터를 가공한 결과이다
  */

  const data = accidents.map(accident => {
    return {
      name: accident.spot_nm.split(" ").slice(2).join(" "),
      발생건수: accident.occrrnc_cnt,
      중상자수: accident.se_dnv_cnt,
      사망자수: accident.dth_dnv_cnt
    }
  })

  return (
    <ResponsiveContainer width="100%" height="100%">
      <ComposedChart
        layout="vertical"
        width={500}
        height={400}
        data={data}
        margin={{
          top: 40,
          left: 120,
        }}
      >
        <CartesianGrid stroke="#f5f5f5" />
        <XAxis type="number" />
        <YAxis dataKey="name" type="category" scale="band" />
        <Tooltip />
        <Legend />
        <Bar dataKey="발생건수" barSize={20} fill="#0088fe" />
        <Bar dataKey="중상자수" barSize={20} fill="#ffbb28" />
        <Bar dataKey="사망자수" barSize={20} fill="#ff8042" />
      </ComposedChart>
    </ResponsiveContainer>
  );
}
