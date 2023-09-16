export const CODES = [
  { cityCode: 11, districtCode: 680, districtId: "d0" },
  { cityCode: 11, districtCode: 440, districtId: "d1" },
  { cityCode: 11, districtCode: 110, districtId: "d2" },
  { cityCode: 28, districtCode: 185, districtId: "d3" },
  { cityCode: 28, districtCode: 237, districtId: "d4" },
  { cityCode: 28, districtCode: 200, districtId: "d5" },
]

export async function getPublicData(districtId, year) {
  const code = CODES.find(CODE => CODE.districtId === districtId);

  let url = "https://apis.data.go.kr/B552061/frequentzoneBicycle/getRestFrequentzoneBicycle";

  // query
  url += "?serviceKey=" + process.env.REACT_APP_SERVICE_KEY;
  url += "&type=json";
  url += "&numOfRows=10";
  url += "&pageNo=1";
  url += "&siDo=" + code.cityCode;
  url += "&guGun=" + code.districtCode;
  url += "&searchYearCd=" + year;

  const res = await fetch(url, {});

  if (!res.ok) {
    throw new Error(`${res.status} ${res.statusText}`);
  }

  return res.json();
}

