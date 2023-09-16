import { Map, MapMarker, MapInfoWindow } from 'react-kakao-maps-sdk';

export default function KakaoMap({ accidents }) {
  const mapInfoWindows = accidents.map(accident => (
    <MapInfoWindow
      key={accident.la_crd}
      position={{ lat: accident.la_crd, lng: accident.lo_crd }}
      removable={true}
    >
      <div style={{ padding: "5px", color: "#000" }}>
        {accident.spot_nm.split(" ").slice(2).join(" ")}
      </div>
    </MapInfoWindow>
  ))

  return (
    <Map
      center={{ lat: accidents[0].la_crd, lng: accidents[0].lo_crd }}
      style={{ width: "100%", height: "100%" }}
      level={6}
    >
      {mapInfoWindows}
    </Map>
  )
}