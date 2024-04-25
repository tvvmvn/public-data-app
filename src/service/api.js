export async function getPublicData(districtId, year) {
  
  // 공공데이터의 지역 코드 
  const CODES = [
    { city: 11, district: 680, districtId: "d0" },
    { city: 11, district: 440, districtId: "d1" },
    { city: 28, district: 185, districtId: "d2" },
    { city: 28, district: 237, districtId: "d3" },
  ]

  // districtId와 지역코드를 맵핑한다
  const code = CODES.find(CODE => CODE.districtId === districtId);

  let url = "https://apis.data.go.kr/B552061/frequentzoneBicycle/getRestFrequentzoneBicycle";

  // query string
  url += "?serviceKey=ej1Ks%2BJlOlaxMbo9WNIR55NnUjmFV18BiRarUFY06EoWjNSfRk9ilRtcjvc31ixBg0LgZmw%2BLmtOA2AUCe%2BRIw%3D%3D"; 
  url += "&type=json";
  url += "&numOfRows=10";
  url += "&pageNo=1";
  url += "&siDo=" + code.city;
  url += "&guGun=" + code.district;
  url += "&searchYearCd=" + year;

  const res = await fetch(url, {});

  if (!res.ok) {
    throw new Error(`${res.status} ${res.statusText}`);
  }

  return res.json();
}

