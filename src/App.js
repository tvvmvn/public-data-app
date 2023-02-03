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

export default function App() {
  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [data, setData] = useState(null);
  const [goGun, setGogun] = useState(680);
  const [searchYearCd, setSearchYearCd] = useState(2018);

  console.log(data);

  useEffect(() => {
    fetchData();
  }, [])

  function fetchData() {
    setIsLoaded(false);

    const endPoint = 'https://apis.data.go.kr/B552061/frequentzoneBicycle/getRestFrequentzoneBicycle'
    const serviceKey = process.env.REACT_APP_SERVICE_KEY;
    const siDo = 11;
    const type = 'json';
    const numOfRows = 10
    const pageNo = 1

    fetch(`${endPoint}?serviceKey=${serviceKey}&searchYearCd=${searchYearCd}&siDo=${siDo}&guGun=${goGun}&type=${type}&numOfRows=${numOfRows}&pageNo=${pageNo}`)
      .then(res => {
        if (!res.ok) {
          throw res;
        }
        return res.json()
      })
      .then(data => {
        setData(data);
      })
      .catch(error => {
        setError(error)
      })
      .finally(() => {
        setIsLoaded(true)
      })
  }

  function handleSubmit(e) {
    e.preventDefault();
    fetchData();
  }

  return (
    <div style={{ margin: "1rem" }}>
      <h1>서울특별시 자전거 사고조회 &#128561;</h1>

      <form onSubmit={handleSubmit}>
        <h2>지역과 연도를 선택하십시오</h2>
        <div>
          <label htmlFor=""></label>
          <select name="goGun" value={goGun} onChange={({target}) => setGogun(target.value)}>
            <option value="680">강남구</option>
            <option value="440">마포구</option>
            <option value="110">종로구</option>
          </select>
        </div>
        <div>
          <label htmlFor=""></label>
          <select name="searchYearCd" value={searchYearCd} onChange={({target}) => setSearchYearCd(target.value)}>
            <option value="2018">2018</option>
            <option value="2019">2019</option>
            <option value="2020">2020</option>
          </select>
        </div>
        <button type="submit" disabled={!isLoaded}>
          Submit
        </button>
      </form>

      <hr />

      <List error={error} isLoaded={isLoaded} data={data} />
    </div>
  )
}

function List({error, isLoaded, data}) {
  if (error) {
    return <p>failed to fetch</p>
  }

  if (!isLoaded) {
    return <p>fetching data...</p>
  }

  return data.totalCount > 0 ? (
    <>
      <Rechart accidents={data.items.item} />
      <KakaoMap accidents={data.items.item} /> 
    </>  
  ) : (
    <p>자료가 없습니다</p>  
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
