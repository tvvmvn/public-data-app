import React, { useState, useContext, useEffect, useRef } from 'react';
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

// 프로젝트에 필요한 데이터 객체를 구성한다
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

const years = [2022, 2021, 2020];

// 서버에 데이터를 요청하는 함수
function fetchData(city, year) {

  const endPoint = 'https://apis.data.go.kr/B552061/frequentzoneBicycle/getRestFrequentzoneBicycle'
  const serviceKey = process.env.REACT_APP_SERVICE_KEY;
  const type = 'json';
  const numOfRows = 10;
  const pageNo = 1;

  // 자바스크립트에 내장된 fetch() 메서드를 사용하여 서버에 요청한다
  const promise = fetch(`${endPoint}?serviceKey=${serviceKey}&searchYearCd=${year}&siDo=${city.siDo}&guGun=${city.goGun}&type=${type}&numOfRows=${numOfRows}&pageNo=${pageNo}`)
    .then(res => {
      // 서버의 응답코드(status)가 200(성공)이 아닌 경우 catch 블록에 응답 객체를 던진다
      if (!res.ok) { 
        throw res;
      }
      // 서버의 응답코드가 200인 경우 응답객체(프로미스 객체)를 리턴한다
      return res.json();
    })

  return promise;
}

// 메인 컴포넌트 
export default function App() {

  const [year, setYear] = useState(years[0]);
  const [city, setCity] = useState(seoul[0]);

  return (
    <>
      {/* Side Bar */}
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

      {/* 메인 */}
      <main>
        <div id="select-year">
          <select onChange={(e) => setYear(e.target.value)}>
            {years.map(year => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
        </div>

        {/* 대시보드에 city와 year변수를 전달한다 */}
        <Dashboard city={city} year={year} />
      </main>
    </>
  )
}

// 대시보드 
function Dashboard({ city, year }) {

  const [data, setData] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {

    // 서버에 요청하기 전 사용자에게 대기 상태를 먼저 보여주어야 한다
    setIsLoaded(false); 
    setError(null);

      // fetchData함수에 city와 year 변수를 전달한다
      fetchData(city, year)
        .then(data => {
          setData(data);
        })
        .catch(error => {
          setError(error);
        })
        .finally(() => setIsLoaded(true)); // 성공 실패와 관계없이 서버가 응답하면 대기상태를 해제한다

  }, [city, year]) // city 또는 year 변수가 업데이트되면 서버에 다시 데이터를 요청한다

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
          {/* DATA를 합성된 컴포넌트에 전달한다 */}
          <Rechart accidents={data.items.item} />
          <KakaoMap accidents={data.items.item} />
        </>
      ) : (
        // 데이터가 없으면 사용자에게 자료가 없다는 것을 알려야 한다
        <p>자료가 없습니다</p>
      )}
    </>
  )
}

// 리차트 (리액트 차트 라이브러리)
function Rechart({ accidents }) {

  console.log(accidents); // 데이터가 전달되었는지 확인 후 아래 코드를 작성하세요

  // 리차트가 요구하는 형식에 맞게 데이터를 구성한다
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

// 카카오 지도 
function KakaoMap({ accidents }) {

  console.log(accidents) // 데이터가 전달되었는지 확인 후 아래 코드를 작성하세요

  // MapInfoWindow 컴포넌트를 재사용한다
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