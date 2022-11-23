import React, {useState, useContext, useEffect, useRef} from 'react';
import logo from './logo.svg';
import './App.css';
import {Map, MapMarker} from 'react-kakao-maps-sdk';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

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
  const [data, setData] = useState(null);
  const [searchYearCd, setSearchYearCd] = useState(2015);

  console.log(data);

  useEffect(() => {  
    // setIsLoaded(false);

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
      <h1>Application</h1>

      <div className="">
        {/* Event */}
        <h2>Year</h2>
        <p>{searchYearCd}</p>
        <button onClick={() => setSearchYearCd(searchYearCd - 1)}>Prev</button>
        <button onClick={() => setSearchYearCd(searchYearCd + 1)}>Next</button>
      </div>

      <div className="">
        <h2>Result</h2>
        <ul>
          {data.items.item.map((item, index) => (
            <li key={index}>{item.spot_nm}</li>
          ))}
        </ul>
      </div>

      <div>
        <h2>Map</h2>
        <KakaoMap />
      </div>

      <div>
        <h2>Chart</h2>
        <div style={{height: "200px"}}>
         <Rechart />
        </div>
      </div>
    </div>  
  )
}

function KakaoMap(){
  const positions = [
    {
      title: "카카오",
      latlng: { lat: 33.450705, lng: 126.570677 },
    },
    {
      title: "생태연못",
      latlng: { lat: 33.450936, lng: 126.569477 },
    },
    {
      title: "텃밭",
      latlng: { lat: 33.450879, lng: 126.56994 },
    },
    {
      title: "근린공원",
      latlng: { lat: 33.451393, lng: 126.570738 },
    },
  ]

  return (
    <Map // 지도를 표시할 Container
      center={{
        // 지도의 중심좌표
        lat: 33.450701,
        lng: 126.570667,
      }}
      style={{
        // 지도의 크기
        width: "100%",
        height: "450px",
      }}
      level={3} // 지도의 확대 레벨
    >
      {positions.map((position, index) => (
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

function Rechart() {
  const chartData = [
    {name: 'Page A', uv: 4000, pv: 2400, amt: 2400,},
    {name: 'Page B', uv: 3000, pv: 1398, amt: 2210,},
    {name: 'Page C', uv: 2000, pv: 9800, amt: 2290,},
    {name: 'Page D', uv: 2780, pv: 3908, amt: 2000,},
    {name: 'Page E', uv: 1890, pv: 4800, amt: 2181,},
    {name: 'Page F', uv: 2390, pv: 3800, amt: 2500,},
    {name: 'Page G', uv: 3490, pv: 4300, amt: 2100,},
  ];

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart
        width={500}
        height={300}
        data={chartData}
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
        <Line type="monotone" dataKey="pv" stroke="#8884d8" activeDot={{ r: 8 }} />
        <Line type="monotone" dataKey="uv" stroke="#82ca9d" />
      </LineChart>
    </ResponsiveContainer>  
  )
}