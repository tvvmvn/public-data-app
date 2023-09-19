import { useState } from 'react';
import { Map, MapMarker, Roadview } from 'react-kakao-maps-sdk';

export default function KakaoMap({ accidents }){
  const center = accidents[0];
  const [spotId, setSpotId] = useState(center.afos_fid);
  const [roadViewCoord, setRoadViewCoord] = useState({
    lat: center.la_crd,
    lng: center.lo_crd
  });

  function handleClick(accident) {
    setSpotId(accident.afos_fid);
    setRoadViewCoord({ lat: accident.la_crd, lng: accident.lo_crd });
  }

  const eventMarkerContainers = accidents.map(accident => (
    <MapMarker
      key={accident.afos_fid}
      position={{ lat: accident.la_crd, lng: accident.lo_crd }}
      onClick={() => handleClick(accident)}
    >
      {accident.afos_fid === spotId && (
        <div style={{ color: "#000" }}>
          {accident.spot_nm.split(" ").slice(2).join(" ")}
        </div>
      )}
    </MapMarker>
  ))
  
  return (
    <div className="relative h-[450px]">
      <Map 
        center={{ lat: center.la_crd, lng: center.lo_crd }}
        className="h-full"
        level={6}
      >
        {eventMarkerContainers}
      </Map>
      <Roadview
        className="absolute top-[75px] right-[25px] w-[500px] h-[300px] z-10 rounded-2xl shadow-2xl"
        position={{
          lat: roadViewCoord.lat,
          lng: roadViewCoord.lng,
          radius: 50,
        }}
      />
    </div>
  )
}
