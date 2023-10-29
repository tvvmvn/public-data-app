import { DISTRICTS } from "./constants/districts";
import { YEARS } from './constants/years';
import { useState, useEffect } from 'react';
import Dashboard from './components/Dashboard';

export default function App() {
  const [districtId, setDistrictId] = useState("d0");
  const [year, setYear] = useState(2022);

  useEffect(() => {
    document.title = "자전거 사고 통계 조회";
  }, [])

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
      <header className="sticky top-0 z-[9999] shadow">
        <div className="h-16  bg-white flex justify-between px-8">
          <div className="flex items-center">
            <div className="flex items-center">
              <img 
                className="w-12"
                src={process.env.PUBLIC_URL + "/images/logo.png"} 
                alt="" 
              /> 
              <h3 className="ml-2 text-2xl text-gray-500 font-semibold">
                자전거 사고 통계 조회
              </h3>
            </div>
          </div>
          <div className="flex items-center">
            <select 
              className="p-2 bg-gray-200 rounded"
              onChange={({ target }) => setDistrictId(target.value)}
            >
              {districtList}
            </select>

            <select 
              className="p-2 ml-2 bg-gray-200 rounded"
              onChange={({ target }) => setYear(target.value)}
            >
              {yearList}
            </select>
          </div>
        </div>
      </header>
      

      <main className="pb-4">
        <Dashboard 
          districtId={districtId} 
          year={year}
        />
      </main>
    </>  
  )
}