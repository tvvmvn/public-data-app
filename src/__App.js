import { useEffect, useState } from 'react';
import { Map, MapMarker, Polygon } from 'react-kakao-maps-sdk';

export default function App() {

  const [data, setData] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch("http://apis.data.go.kr/B552061/frequentzoneBicycle/getRestFrequentzoneBicycle?ServiceKey=ej1Ks%2BJlOlaxMbo9WNIR55NnUjmFV18BiRarUFY06EoWjNSfRk9ilRtcjvc31ixBg0LgZmw%2BLmtOA2AUCe%2BRIw%3D%3D&type=json&searchYearCd=2021&siDo=11&guGun=110&numOfRows=10&pageNo=1", {})
      .then(res => {
        if (!res.ok) {
          throw res;
        }
        return res.json();
      })
      .then(data => {
        console.log(data)
        setData(data.items.item[0]);
      })
      .catch(error => {
        console.error(error);
        setError(error);
      })
      .finally(() => setIsLoaded(true))
  }, [])

  if (error) {
    return <p>error</p>
  }

  if (!isLoaded) {
    return <p>Loading..</p>
  }

  const path = JSON.parse(data.geom_json).coordinates[0];

  const d = path.map(item => {
    return { lat: item[1], lng: item[0] }
  })

  return (
    <>
      <Map // 지도를 표시할 Container
        center={{
          // 지도의 중심좌표
          lat: data.la_crd,
          lng: data.lo_crd,
        }}
        style={{
          // 지도의 크기
          width: "100%",
          height: "450px",
        }}
        level={3} // 지도의 확대 레벨
      >
        <MapMarker // 마커를 생성합니다
          position={{
            // 마커가 표시될 위치입니다
            lat: data.la_crd,
            lng: data.lo_crd,
          }}
        />
      </Map>
    </>
  )
}