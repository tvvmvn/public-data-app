import { useState, useEffect } from 'react';
import { getPublicData } from '../service/api';
import KakaoMap from './KakaoMap';
import RechartBar from './RechartBar';
import RechartPie1 from './RechartPie1';
import RechartPie2 from './RechartPie2';

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
    return (
      <p className="p-8 text-center text-red-400">
        failed to fetch
      </p>
    )
  }

  if (!isLoaded) {
    return (
      <p className="p-8 text-center">
        fetching data...
      </p>
    )
  }

  return accidentCount > 0 ? (
    <div className="flex px-4">
      <div className="w-1/2 h-[600px]">
        <KakaoMap accidents={accidents} />
      </div>
      <div className="w-1/2 pl-4 flex flex-col h-[600px]">
        <div className="h-[300px]">
          <RechartBar accidents={accidents} />
        </div>
        <div className="flex h-[300px] pt-4">
          <div className="w-1/2 flex flex-col items-center">
            <h3 className="text-xl">Accidents for District</h3>
            <RechartPie1 accidents={accidents} />
          </div>
          <div className="w-1/2 flex flex-col items-center">
            <h3 className="text-xl">Accidents for District</h3>
            <RechartPie2 accidents={accidents} />
          </div>
        </div>
      </div>
    </div>
  ) : (
    <p className="p-8 text-center">No Data</p>
  )
}