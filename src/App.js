import { useState, useEffect } from 'react';
import { DISTRICTS } from "./constants/districts";
import { YEARS } from './constants/years';
import { getPublicData } from './service/api';

export default function App() {
  const [districtId, setDistrictId] = useState("d0");
  const [year, setYear] = useState(2023);

  // key state
  console.log(districtId, year);

  useEffect(() => {
    fetchData();
  }, [districtId, year])

  useEffect(() => {
    document.title = "Public Data App";
  }, [])

  async function fetchData() {
    try {
      const data = await getPublicData(districtId, year);
      console.log(data);
    } catch (error) {
      console.error(error)
    }
  }

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
      <h1>App</h1>
      <select onChange={({ target }) => setDistrictId(target.value)}>
        {districtList}
      </select>

      <select onChange={({ target }) => setYear(target.value)}>
        {yearList}
      </select>
    </>  
  )
}