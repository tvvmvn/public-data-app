import { useState, useEffect } from 'react';
import { getPublicData } from '../service/api';
import KakaoMap from './KakaoMap';
import RechartBar from './RechartBar';
import RechartPie from './RechartPie';

export default function Dashboard({
  districtId,
  year
}) {
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
      setIsLoaded(error)
    } finally {
      setIsLoaded(true);
    }
  }

  useEffect(() => {
    fetchData();
  }, [districtId, year])

  if (error) {
    return <p className="p-8 text-center text-red-400">failed to fetch</p>
  }

  if (!isLoaded) {
    return <p className="p-8 text-center">fetching data...</p>
  }

  return accidentCount > 0 ? (
    <>
      {/* KakaoMap */}
      <KakaoMap accidents={accidents} />
      <div className="flex h-[350px] items-center mt-16 px-4">
        {/* Rechart Bar */}
        <div className="flex flex-col items-center w-1/2 h-full">
          <h3 className="text-xl">Accidents per town</h3>
          <RechartBar accidents={accidents} />
        </div>
        {/* Rechart Pie */}
        <div className="w-1/2 flex h-full">
          <RechartPie accidents={accidents} fill="#0088fe" />
          <RechartPie accidents={accidents} fill="#ffbb28" />
        </div>
      </div>
    </>
  ) : (
    <p className="p-8 text-center">No Data</p>
  )
}