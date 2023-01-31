import React, {useState, useContext, useEffect, useRef} from 'react';
import logo from './logo.svg';
import './App.css';
import {Map, MapMarker} from 'react-kakao-maps-sdk';
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
  const url = `https://apis.data.go.kr/B552061/frequentzoneBicycle/getRestFrequentzoneBicycle?serviceKey=${process.env.REACT_APP_SERVICE_KEY}&searchYearCd=${searchYearCd}&siDo=11&guGun=110&type=json&numOfRows=10&pageNo=1`;

  const promise = fetch(url)
  .then(res => {
    if (!res.ok) {
      throw res;
    }
    return res.json();
  })

  return promise;
}

export default App;

function App() {
  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [items, setItems] = useState(null);
  const [searchYearCd, setSearchYearCd] = useState(2015);

  useEffect(() => {  
    setIsLoaded(false);

    fetchData(searchYearCd)
    .then(data => {
      console.log(data);
      setItems(data.items.item);
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
      <h1>App &#128690;</h1>

      <h2>Choose Year</h2>
      <div className="">
        {/* Event */}
        <p>{searchYearCd}</p>
        <button onClick={() => setSearchYearCd(searchYearCd - 1)}>Prev</button>
        <button onClick={() => setSearchYearCd(searchYearCd + 1)}>Next</button>
      </div>

      <h2>Table</h2>
      <Table items={items} />

      <h2>Chart</h2>
      <div style={{height: "200px"}}>
        <Rechart items={items} />
      </div>

      <h2>Map</h2>
      <KakaoMap items={items} />

    </div>  
  )
}

function Table({items}) {

  return (
    <ul>
      {items.map(item => (
        <li key={item.spot_nm}>{item.spot_nm}</li>
      ))}
    </ul>
  )
}

function KakaoMap({items}){

  const center = {
    lat: items[0].la_crd,
    lng: items[0].lo_crd
  }

  const positions = items.map(item => {
    return {
      title: item.spot_nm,
      latlng: {lat: item.la_crd , lng: item.lo_crd}
    }
  })

  return (
    // 지도를 표시할 Container
    <Map 
      // 지도의 중심좌표
      center={center}
      style={{
        // 지도의 크기
        width: "100%",
        height: "450px",
      }}
      level={3} // 지도의 확대 레벨
    >
      {positions.map(position => (
        <MapMarker
          key={`${position.title}-${position.latlng}`}
          position={position.latlng} // 마커를 표시할 위치
          image={{
            src: "https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/markerStar.png", // 마커이미지의 주소입니다
            size: {
              width: 24,
              height: 35
            }, // 마커이미지의 크기입니다
          }}
          title={position.title} // 마커의 타이틀, 마커에 마우스를 올리면 타이틀이 표시됩니다
        />
      ))}
    </Map>
  )
}

function Rechart({items}) {

  console.log(items);

  const data = items.map(item => {
    return {
      name: item.spot_nm,
      발생건수: item.occrrnc_cnt,
      사망자수: item.dth_dnv_cnt,
      중상자수: item.se_dnv_cnt
    }
  })

  return (
    <ResponsiveContainer width="100%" height="100%">
    <BarChart
      width={500}
      height={300}
      data={data}
      margin={{
        top: 5,
        right: 30,
        left: 20,
        bottom: 5,
      }}
    >
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="name" />
      <YAxis />
      <Tooltip />
      <Legend />
      <Bar dataKey="발생건수" fill="#0bf" />
      <Bar dataKey="사망자수" fill="#f00" />
      <Bar dataKey="중상자수" fill="#fa0" />
    </BarChart>
  </ResponsiveContainer>
  )
}