import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from "recharts";

export default function RechartBar({ accidents }) {
  const data = accidents.map(accident => {
    return {
      name: accident.spot_nm.split(" ").slice(2).join(" "),
      발생건수: accident.occrrnc_cnt,
      중상자수: accident.se_dnv_cnt,
      사망자수: accident.dth_dnv_cnt
    }
  })

  return (
    <div className="h-[400px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          width={500}
          height={300}
          data={data}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="발생건수" fill="#0af" />
          <Bar dataKey="중상자수" fill="#fa0" />
          <Bar dataKey="사망자수" fill="#f00" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}


