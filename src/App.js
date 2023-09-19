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
      <header className="h-32 flex justify-center items-center relative">
        <img 
          className="w-24"
          src={process.env.PUBLIC_URL + "/images/logo.png"} 
          alt="" 
        />
        <h1 className="text-4xl">자전거 사고 통계 조회</h1>

        <div className="absolute flex right-0 h-full">
          <div className="flex items-center px-8">
            <select 
              className="p-2 bg-gray-200"
              onChange={({ target }) => setDistrictId(target.value)}
            >
              {districtList}
            </select>

            <select 
              className="p-2 ml-2 bg-gray-200"
              onChange={({ target }) => setYear(target.value)}
            >
              {yearList}
            </select>
          </div>
        </div>
      </header>
      

      <main className="pb-12">
        <Dashboard 
          districtId={districtId} 
          year={year}
        />
      </main>
    </>  
  )
}