import React, { useState, useContext, useEffect, useRef } from 'react';
import logo from './logo.svg';
import './App.css';
import { Map, MapMarker, MapInfoWindow } from 'react-kakao-maps-sdk';
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

const seoul = [
  { siDo: 11, goGun: 680, name: '강남구' },
  { siDo: 11, goGun: 440, name: '마포구' },
  { siDo: 11, goGun: 110, name: '종로구' }
]

const incheon = [
  { siDo: 28, goGun: 185, name: '연수구' },
  { siDo: 28, goGun: 237, name: '부평구' },
  { siDo: 28, goGun: 170, name: '미추홀구' }
]

const years = [2018, 2019, 2020];

export default function App() {

  const [year, setYear] = useState(2018);
  const [city, setCity] = useState(seoul[0]);

  return (
    <>
      <nav>
        <h1>자전거 사고조회</h1>
        <section>
          <h3>서울</h3>
          {seoul.map(city => (
            <button
              key={city.id}
              onClick={() => setCity(city)}
            >
              {city.name}
            </button>
          ))}
        </section>
        <section>
          <h3>인천</h3>
          {incheon.map(city => (
            <button
              key={city.id}
              onClick={() => setCity(city)}
            >
              {city.name}
            </button>
          ))}
        </section>
      </nav>

      <main>
        <div id="select-year">
          <select onChange={(e) => setYear(e.target.value)}>
            {years.map(year => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
        </div>

        <Dashboard city={city} year={year} />
      </main>
    </>
  )
}

function Dashboard({ city, year }) {

  const [data, setData] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {

    const endPoint = 'https://apis.data.go.kr/B552061/frequentzoneBicycle/getRestFrequentzoneBicycle'
    const serviceKey = process.env.REACT_APP_SERVICE_KEY;
    const type = 'json';
    const numOfRows = 10;
    const pageNo = 1;

    setIsLoaded(false);
    setError(null);

    fetch(`${endPoint}?serviceKey=${serviceKey}&searchYearCd=${year}&siDo=${city.siDo}&guGun=${city.goGun}&type=${type}&numOfRows=${numOfRows}&pageNo=${pageNo}`)
      .then(res => {
        if (!res.ok) {
          throw res;
        }
        return res.json();
      })
      .then(data => {
        console.log(data);
        setData(data);
      })
      .catch(error => {
        console.error(error);
        setError(error)
      })
      .finally(() => setIsLoaded(true));

  }, [city, year]) 

  if (error) {
    return <p>failed to fetch</p>
  }

  if (!isLoaded) {
    return <p>fetching data...</p>
  }

  return (
    <>
      <h1>{year}년 {city.name} 사고조회 결과</h1>
      {data.totalCount > 0 ? (
        <>
          <Rechart accidents={data.items.item} />
          <KakaoMap accidents={data.items.item} />
        </>
      ) : (
        <p>No data</p>
      )}
    </>
  )
}

function Rechart({ accidents }) {

  console.log(accidents); // 데이터가 전달되었는지 확인 후 아래 코드로 이동하십시오

  const chartData = accidents.map(accident => {
    return {
      name: accident.spot_nm.split(' ')[2],
      발생건수: accident.occrrnc_cnt,
      중상자수: accident.se_dnv_cnt,
      사망자수: accident.dth_dnv_cnt
    }
  })

  return (
    <div style={{ height: "300px" }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          width={500}
          height={300}
          data={chartData}
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

function KakaoMap({ accidents }) {

  console.log(accidents)

  const mapInfoWindows = accidents.map(accident => (
    <MapInfoWindow
      key={accident.la_crd}
      position={{ lat: accident.la_crd, lng: accident.lo_crd }}
      removable={true}
    >
      <div style={{ padding: "5px", color: "#000" }}>
        {accident.spot_nm.split(' ')[2]}
      </div>
    </MapInfoWindow>
  ))

  return (
    <Map
      center={{ lat: accidents[0].la_crd, lng: accidents[0].lo_crd }}
      style={{ width: "100%", height: "450px" }}
      level={5}
    >
      {mapInfoWindows}
    </Map>
  )
}