export default function Board({ accidents }) {
  console.log(accidents);

  let totalCount = 0;
  let deathCount = 0;
  let woundCount = 0;
  let injuredCount = 0;
  let casualtiesCount = 0;

  accidents.forEach(accident => {
    totalCount += accident.occrrnc_cnt;
    deathCount += accident.dth_dnv_cnt;
    woundCount += accident.se_dnv_cnt;
    injuredCount += accident.sl_dnv_cnt;
    casualtiesCount += accident.caslt_cnt;
  })

  return (
    <ul className="grid grid-cols-4 gap-2 mb-4">
      <li className="p-4 flex flex-col items-center border">
        <span>발생건수 </span>
        <span className="text-2xl">{totalCount}</span>
      </li>
      <li className="p-4 flex flex-col items-center border">
        <span>사상자수</span>
        <span className="text-2xl">{casualtiesCount}</span>
      </li>
      <li className="p-4 flex flex-col items-center border">
        <span>중상자수</span>
        <span className="text-2xl">{woundCount}</span>
      </li>
      <li className="p-4 flex flex-col items-center border">
        <span>경상자수</span>
        <span className="text-2xl">{injuredCount}</span>
        </li>
      <li className="p-4 flex flex-col items-center border">
        <span>사망자수</span>
        <span className="text-2xl">{deathCount}</span>
      </li>
    </ul>  
  )
}
