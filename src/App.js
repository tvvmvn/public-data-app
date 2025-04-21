import { useState } from 'react';
import Dashboard from './components/Dashboard';

const DISTRICTS = [
  { id: "d0", city: "서울특별시", name: "강남구" },
  { id: "d1", city: "서울특별시", name: "마포구" },
  { id: "d2", city: "인천광역시", name: "연수구" },
  { id: "d3", city: "인천광역시", name: "부평구" },
]

const YEARS = [2022, 2021, 2020];

export default function App() {
  
  const [districtId, setDistrictId] = useState("d0");
  const [year, setYear] = useState(2022);

  const districtList = DISTRICTS.map(district => (
    <option key={district.id} value={district.id}>
      {district.city} {district.name}
    </option>
  ))

  const yearList = YEARS.map(year => (
    <option key={year} value={year}>
      {year}
    </option>
  ))

  return (
    <>
      <header className="fixed top-0 w-full z-[9999] shadow">
        <div className="h-16 bg-white flex justify-between px-8">
          <div className="flex items-center">
            <img
              className="w-12"
              src={process.env.PUBLIC_URL + "/logo.png"}
              alt="logo"
            />
            <h3 className="ml-2 text-2xl text-gray-500 font-semibold">
              자전거 사고 통계 조회
            </h3>
          </div>
          <div className="flex items-center">
            <select 
              className="p-2 border border-gray-400 rounded"
              onChange={({ target }) => setDistrictId(target.value)}
            >
              {districtList}
            </select>

            <select 
              className="p-2 ml-2 border border-gray-400 rounded"
              onChange={({ target }) => setYear(target.value)}
            >
              {yearList}
            </select>
          </div>
        </div>
      </header>
      
      <main>
        <Dashboard districtId={districtId} year={year} />
      </main>
    </>  
  )
}