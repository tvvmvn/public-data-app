import React, { useState, useEffect } from 'react';
import { DISTRICTS } from './constants/cities';
import { YEARS } from './constants/years';
import getData from './service/api';
import Board from './components/Board';
import RechartBar from './components/RechartBar';
import RechartPie from './components/RechartPie';
import KakaoMap from './components/KakaoMap';

export default function App() {
  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [year, setYear] = useState(YEARS[0]);
  const [district, setDistrict] = useState(DISTRICTS[0]);
  const [accidents, setAccidents] = useState([]);
  const [accidentCount, setAccidentCount] = useState(0);

  // tracking key state
  console.log(accidents);

  useEffect(() => {
    fetchData()
  }, [district, year]) 

  async function fetchData() {
    try {
      setIsLoaded(false); 
      setError(null);

      const data = await getData(district.cityId, district.districtId, year);

      setAccidents(data.items.item);
      setAccidentCount(data.totalCount);
      
    } catch (error) {
      setError(error)
    } finally {
      setIsLoaded(true)
    }
  }

  if (error) {
    return <p>{error.message}</p>
  }

  if (!isLoaded) {
    return <p>fetching data...</p>
  }

  return (
    <>
      <header className="px-4 py-4">
        <h1 className="text-xl font-semibold">
          {year}년 {district.cityName} {district.districtName} 자전거 사고조회 결과
        </h1>
      </header>

      {accidentCount > 0 ? (
        <>
          {/* <Board accidents={accidents} /> */}

          <Form />

          <KakaoMap accidents={accidents} />

          <div className="grid grid-cols-2">
            <RechartBar accidents={accidents} />
            <RechartPie accidents={accidents} />
          </div>
        </>
      ) : (
        <p>자료가 없습니다</p>
      )}
    </>
  )
}

function Form() {
  return (
    <div>
      <h3>District</h3>
      <select
         className="border"
      >
        {DISTRICTS.map(district => (
          <option>{district.name}</option>  
        ))}
      </select>
    </div>
  )

}


function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition((position) => {
      console.log("latitude:", position.coords.latitude);
      console.log("longitude:", position.coords.longitude);        
    });
  } else { 
    console.log("Geolocation is not supported by this browser.");
  }
}