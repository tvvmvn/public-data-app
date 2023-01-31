import React, {useState, useContext, useEffect, useRef} from 'react';
import logo from './logo.svg';
import './App.css';
import {Map, MapMarker, MapInfoWindow} from 'react-kakao-maps-sdk';
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

function fetchData(searchYearCd) {

  const endPoint = 'https://apis.data.go.kr/B552061/frequentzoneBicycle/getRestFrequentzoneBicycle'
  const serviceKey = process.env.REACT_APP_SERVICE_KEY;
  const siDo = 11;
  const goGun = 440;
  const type = 'json';
  const numOfRows = 10
  const pageNo = 1

  const promise = fetch(`${endPoint}?serviceKey=${serviceKey}&searchYearCd=${searchYearCd}&siDo=${siDo}&guGun=${goGun}&type=${type}&numOfRows=${numOfRows}&pageNo=${pageNo}`)
    .then(res => {
      if (!res.ok) {
        throw res;
      }
      return res.json();
    })

  return promise;
}

export default function App() {
  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [data, setData] = useState(null);
  const [searchYearCd, setSearchYearCd] = useState(2015);

  console.log(data);

  useEffect(() => {  
    setIsLoaded(false);

    fetchData(searchYearCd)
    .then(data => {
      setData(data);
    })
    .catch(error => {
      setError(error)
    })
    .finally(() => setIsLoaded(true))
  }, [searchYearCd])

  if (error) {
    return <p>failed to fetch</p>
  }

  if (!isLoaded) {
    return <p>fetching data...</p>
  }

  return (
    <div style={{margin: "1rem"}}>
      <h1>{searchYearCd}년 서울특별시 마포구 자전거 사고조회 &#128561;</h1>

      <h2>조회하실 연도를 선택하십시오</h2>
      <div className="">
        <button onClick={() => setSearchYearCd(searchYearCd - 1)}>&#10094; 이전년도</button>
        <button onClick={() => setSearchYearCd(searchYearCd + 1)}>다음년도 &#10095;</button>
      </div>

      {data.totalCount > 0 ? (
        <>
          <h2>요약</h2>
          <p>총 {data.totalCount}건의 사고가 발생했습니다</p>

          <h2>Chart</h2>
          <Rechart accidents={data.items.item} />

          <h2>지도</h2>
          <p>지도를 확대 또는 축소할 수 있습니다</p>
          <KakaoMap accidents={data.items.item} />
        </>
      ) : (
        <p>해당 년도 자료가 없습니다</p>
      )}
    </div>  
  )
}

function Rechart({accidents}) {

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

  const mapInfoWindows = accidents.map(accident => (
    <MapInfoWindow
      key={accident.spot_nm}
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
