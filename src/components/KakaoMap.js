import { useState } from 'react';
import { Map, MapMarker, Roadview } from 'react-kakao-maps-sdk';

export default function KakaoMap({ accidents }){
  const center = { 
    spotId: accidents[0].afos_fid,
    lat: accidents[0].la_crd, 
    lng: accidents[0].lo_crd 
  };
  const [spotId, setSpotId] = useState(center.spotId);
  const [roadViewCoord, setRoadViewCoord] = useState({
    lat: center.lat,
    lng: center.lng
  });

  function handleClick(accident) {
    setSpotId(accident.afos_fid);
    setRoadViewCoord({ lat: accident.la_crd, lng: accident.lo_crd });
  }

  const EventMarkerContainers = accidents.map(accident => (
    <MapMarker
      key={accident.afos_fid}
      position={{ lat: accident.la_crd, lng: accident.lo_crd }}
      onClick={() => handleClick(accident)}
    >
      {accident.afos_fid === spotId && (
        <div style={{ color: "#000" }}>
          {accident.spot_nm.split(" ").slice(0).join(" ")}
        </div>
      )}
    </MapMarker>
  ))
  
  return (
    <div className="flex h-[450px]">
      <Map 
        center={{ lat: center.lat, lng: center.lng }}
        className="w-2/3 h-full"
        level={6}
      >
        {EventMarkerContainers}
      </Map>
      <Roadview
        position={{
          lat: roadViewCoord.lat,
          lng: roadViewCoord.lng,
          radius: 50,
        }}
        className="w-1/3 h-full"
      />
    </div>
  )
}
