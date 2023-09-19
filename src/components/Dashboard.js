import { useState, useEffect } from 'react';
import { getPublicData } from '../service/api';
import KakaoMap from './KakaoMap';
import RechartBar from './RechartBar';
import RechartPie from './RechartPie';

export default function Dashboard({ districtId, year }) {
  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [accidents, setAccidents] = useState([]);
  const [accidentCount, setAccidentCount] = useState(0);

  // key state
  console.log(accidents);

  async function fetchData() {
    try {
      setIsLoaded(false);
      setError(null);

      const data = await getPublicData(districtId, year);
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
  }, [districtId, year])

  if (error) {
    return <p className="p-8 text-center text-red-400">{error.message}</p>
  }

  if (!isLoaded) {
    return (
      <div className="p-8 flex justify-center">
        <div className="w-12 h-12 border-8 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  return accidentCount > 0 ? (
    <>
      {/* KakaoMap */}
      <KakaoMap accidents={accidents} />
      <div className="flex items-center mt-12 px-4">
        {/* Rechart Bar */}
        <div className="w-1/2 h-[350px] flex flex-col items-center">
          <h3 className="text-xl">사고 장소별 상세 내용</h3>
          <RechartBar accidents={accidents} />
        </div>
        {/* Rechart Pie */}
        <div className="w-1/2 h-[300px] flex">
          <RechartPie accidents={accidents} fill="#0088fe" />
          <RechartPie accidents={accidents} fill="#ffbb28" />
        </div>
      </div>
    </>
  ) : (
    <p className="p-8 text-center">데이터가 없습니다</p>
  )
}