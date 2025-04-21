import { useState, useEffect } from 'react';
import getPublicData from '../service/api';
import KakaoMap from './KakaoMap';
import RechartPie from './RechartPie';

export default function Dashboard({ districtId, year }) {
  
  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [accidents, setAccidents] = useState([]);
  const [accidentCount, setAccidentCount] = useState(0);

  async function fetchData() {
    try {
      setIsLoaded(false);
      setError(null);

      const data = await getPublicData(districtId, year);
      
      // 응답 데이터
      console.log(data);

      setAccidents(data.items.item);
      setAccidentCount(data.totalCount);

    } catch (error) {
      setError(error)
    } finally {
      setIsLoaded(true);
    }
  }

  useEffect(() => {
    fetchData();
  }, [districtId, year]);

  if (error) {
    return (
      <p className="p-40 text-center text-red-400">
        {error.message}
      </p>
    )
  }

  if (!isLoaded) {
    return (
      <div className="p-40 flex justify-center">
        <div className="w-12 h-12 border-8 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  return accidentCount > 0 ? (
    <div className="h-screen">
      <nav className="fixed top-0 left-0 w-80 h-full z-[999] pt-16 bg-white/80">
      <div id="navInner" className="h-full overflow-y-auto">
        <ul className="px-4">
          {accidents.map((accident, index) => (
            <li className="border-b">
              <h3 className="font-bold my-4">{++index} {accident.spot_nm}</h3>
              <div className="flex gap-2 my-4">
                <span className="font-semibold text-blue-500">
                  발생 {accident.occrrnc_cnt}건
                </span>
                <span className="font-semibold text-orange-500">
                  중상 {accident.se_dnv_cnt}명
                </span>
                <span className="font-semibold text-red-500">
                  사망 {accident.dth_dnv_cnt}명
                </span>
              </div>
            </li>
          ))}
        </ul>

        <RechartPie accidents={accidents} />
      </div>
      </nav>

      <KakaoMap accidents={accidents} />
    </div>
  ) : (
    <p className="p-40 text-center">데이터가 없습니다</p>
  )
}