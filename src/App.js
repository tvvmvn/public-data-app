import { DISTRICTS } from "./constants/districts";
import { YEARS } from './constants/years';
import { useState, useEffect } from 'react';
import Dashboard from './components/Dashboard';

export default function App() {
  const [districtId, setDistrictId] = useState("d0");
  const [year, setYear] = useState(2022);

  useEffect(() => {
    document.title = "Public Data App";
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
      <h1 className="text-4xl font-semibold mt-8 text-center">
        Bicycle Accidents Statistics
      </h1>
      
      <div className="mb-4 flex justify-end px-8">
        <select 
          className="border-2 p-2"
          onChange={({ target }) => setDistrictId(target.value)}
        >
          {districtList}
        </select>

        <select 
          className="border-2 p-2 ml-2"
          onChange={({ target }) => setYear(target.value)}
        >
          {yearList}
        </select>
      </div>

      <Dashboard 
        districtId={districtId} 
        year={year}
      />

      <footer className="bg-gray-200 mt-16 p-16 text-center">
        2023 &copy; tvvmvn
      </footer>
    </>  
  )
}