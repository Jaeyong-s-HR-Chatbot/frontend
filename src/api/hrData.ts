// DB 저장소(data/hr, data/regs)의 데모 데이터에서 일부를 뽑아 온 예시예요. 화면 목업 전용이에요.
import type { EmployeeRow, PayrollByHq, Regulation } from '../types';

export const EMPLOYEES: EmployeeRow[] = [
 {
  "id": "E1016",
  "name": "윤영호",
  "gender": "M",
  "dept": "운전계획팀",
  "hq": "운전본부",
  "site": "본사",
  "job": "운전·승무",
  "position": "부장",
  "grade": 1,
  "duty": "본부장",
  "pattern": "일근",
  "status": "재직",
  "hire": "1994-01-01",
  "email": "e1016@nuri.test",
  "base": 6680000,
  "leave": {
   "granted": 25.0,
   "used": 12.5,
   "remaining": 12.5
  },
  "pay": {
   "gross": 7480000,
   "net": 6095110,
   "overtime": 0.0,
   "deductions": 1384890
  }
 },
 {
  "id": "E1265",
  "name": "정하은",
  "gender": "F",
  "dept": "재무팀",
  "hq": "경영지원본부",
  "site": "본사",
  "job": "사무",
  "position": "차장",
  "grade": 2,
  "duty": "팀원",
  "pattern": "일근",
  "status": "재직",
  "hire": "2011-01-01",
  "email": "e1265@nuri.test",
  "base": 4900000,
  "leave": {
   "granted": 22.0,
   "used": 10.5,
   "remaining": 11.5
  },
  "pay": {
   "gross": 5585350,
   "net": 4677020,
   "overtime": 8.0,
   "deductions": 908330
  }
 },
 {
  "id": "E1307",
  "name": "김수아",
  "gender": "F",
  "dept": "인사팀",
  "hq": "경영지원본부",
  "site": "본사",
  "job": "사무",
  "position": "차장",
  "grade": 2,
  "duty": "팀원",
  "pattern": "일근",
  "status": "재직",
  "hire": "2013-01-01",
  "email": "e1307@nuri.test",
  "base": 4820000,
  "leave": {
   "granted": 21.0,
   "used": 11.5,
   "remaining": 9.5
  },
  "pay": {
   "gross": 5929710,
   "net": 4963280,
   "overtime": 22.0,
   "deductions": 966430
  }
 },
 {
  "id": "E1331",
  "name": "서지호",
  "gender": "M",
  "dept": "전력팀",
  "hq": "기술본부",
  "site": "본사",
  "job": "시설·전기",
  "position": "과장",
  "grade": 3,
  "duty": "팀원",
  "pattern": "일근",
  "status": "재직",
  "hire": "2014-01-01",
  "email": "e1331@nuri.test",
  "base": 4030000,
  "leave": {
   "granted": 20.0,
   "used": 14.0,
   "remaining": 6.0
  },
  "pay": {
   "gross": 4491050,
   "net": 3885300,
   "overtime": 5.5,
   "deductions": 605750
  }
 },
 {
  "id": "E1367",
  "name": "강민재",
  "gender": "M",
  "dept": "IT팀",
  "hq": "경영지원본부",
  "site": "본사",
  "job": "사무",
  "position": "과장",
  "grade": 3,
  "duty": "팀원",
  "pattern": "일근",
  "status": "휴직",
  "hire": "2015-07-01",
  "email": "e1367@nuri.test",
  "base": 3990000,
  "leave": {
   "granted": 20.0,
   "used": 10.5,
   "remaining": 9.5
  },
  "pay": null
 },
 {
  "id": "E1377",
  "name": "최도윤",
  "gender": "M",
  "dept": "차량1사업소",
  "hq": "차량본부",
  "site": "수도권",
  "job": "차량정비",
  "position": "과장",
  "grade": 3,
  "duty": "팀원",
  "pattern": "교대근무",
  "status": "재직",
  "hire": "2016-01-01",
  "email": "e1377@nuri.test",
  "base": 3950000,
  "leave": {
   "granted": 19.0,
   "used": 8.0,
   "remaining": 11.0
  },
  "pay": {
   "gross": 5223150,
   "net": 4375910,
   "overtime": 6.0,
   "deductions": 847240
  }
 },
 {
  "id": "E1412",
  "name": "박지현",
  "gender": "F",
  "dept": "고객서비스팀",
  "hq": "영업본부",
  "site": "본사",
  "job": "역무",
  "position": "과장",
  "grade": 3,
  "duty": "팀원",
  "pattern": "일근",
  "status": "재직",
  "hire": "2017-03-01",
  "email": "e1412@nuri.test",
  "base": 3910000,
  "leave": {
   "granted": 19.0,
   "used": 15.5,
   "remaining": 3.5
  },
  "pay": {
   "gross": 4389660,
   "net": 3798230,
   "overtime": 6.0,
   "deductions": 591430
  }
 },
 {
  "id": "E1465",
  "name": "임태윤",
  "gender": "M",
  "dept": "승무1사업소",
  "hq": "운전본부",
  "site": "수도권",
  "job": "운전·승무",
  "position": "대리",
  "grade": 4,
  "duty": "팀원",
  "pattern": "교번근무",
  "status": "재직",
  "hire": "2019-03-01",
  "email": "e1465@nuri.test",
  "base": 3230000,
  "leave": {
   "granted": 18.0,
   "used": 12.0,
   "remaining": 6.0
  },
  "pay": {
   "gross": 4100460,
   "net": 3549840,
   "overtime": 15.5,
   "deductions": 550620
  }
 },
 {
  "id": "E1584",
  "name": "이서준",
  "gender": "M",
  "dept": "신호팀",
  "hq": "기술본부",
  "site": "본사",
  "job": "시설·전기",
  "position": "대리",
  "grade": 4,
  "duty": "팀원",
  "pattern": "일근",
  "status": "재직",
  "hire": "2023-01-01",
  "email": "e1584@nuri.test",
  "base": 3070000,
  "leave": {
   "granted": 16.0,
   "used": 5.0,
   "remaining": 11.0
  },
  "pay": {
   "gross": 3460950,
   "net": 3000620,
   "overtime": 8.5,
   "deductions": 460330
  }
 },
 {
  "id": "E1764",
  "name": "한소율",
  "gender": "F",
  "dept": "역무1센터",
  "hq": "영업본부",
  "site": "수도권",
  "job": "역무",
  "position": "사원",
  "grade": 5,
  "duty": "팀원",
  "pattern": "교대근무",
  "status": "재직",
  "hire": "2026-03-01",
  "email": "e1764@nuri.test",
  "base": 2450000,
  "leave": {
   "granted": 8.0,
   "used": 4.0,
   "remaining": 4.0
  },
  "pay": {
   "gross": 3135270,
   "net": 2785490,
   "overtime": 14.5,
   "deductions": 349780
  }
 },
 {
  "id": "E1141",
  "name": "권서준",
  "gender": "M",
  "dept": "역무2센터",
  "hq": "영업본부",
  "site": "충청권",
  "job": "역무",
  "position": "차장",
  "grade": 2,
  "duty": "팀원",
  "pattern": "교대근무",
  "status": "재직",
  "hire": "2005-06-01",
  "email": "e1141@nuri.test",
  "base": 5140000,
  "leave": {
   "granted": 25.0,
   "used": 11.5,
   "remaining": 13.5
  },
  "pay": {
   "gross": 6472770,
   "net": 5242250,
   "overtime": 10.0,
   "deductions": 1230520
  }
 },
 {
  "id": "E1606",
  "name": "박미경",
  "gender": "F",
  "dept": "승무2사업소",
  "hq": "운전본부",
  "site": "충청권",
  "job": "운전·승무",
  "position": "사원",
  "grade": 5,
  "duty": "팀원",
  "pattern": "교번근무",
  "status": "재직",
  "hire": "2023-06-01",
  "email": "e1606@nuri.test",
  "base": 2570000,
  "leave": {
   "granted": 16.0,
   "used": 6.5,
   "remaining": 9.5
  },
  "pay": {
   "gross": 3353940,
   "net": 2908720,
   "overtime": 8.5,
   "deductions": 445220
  }
 },
 {
  "id": "E1067",
  "name": "장상호",
  "gender": "M",
  "dept": "차량1사업소",
  "hq": "차량본부",
  "site": "수도권",
  "job": "차량정비",
  "position": "부장",
  "grade": 1,
  "duty": "팀원",
  "pattern": "교대근무",
  "status": "재직",
  "hire": "2000-12-01",
  "email": "e1067@nuri.test",
  "base": 6400000,
  "leave": {
   "granted": 25.0,
   "used": 19.0,
   "remaining": 6.0
  },
  "pay": {
   "gross": 8232280,
   "net": 6470470,
   "overtime": 10.5,
   "deductions": 1761810
  }
 },
 {
  "id": "E1268",
  "name": "이은지",
  "gender": "F",
  "dept": "차량2사업소",
  "hq": "차량본부",
  "site": "영남권",
  "job": "차량정비",
  "position": "차장",
  "grade": 2,
  "duty": "팀원",
  "pattern": "교대근무",
  "status": "재직",
  "hire": "2011-02-01",
  "email": "e1268@nuri.test",
  "base": 4900000,
  "leave": {
   "granted": 22.0,
   "used": 8.5,
   "remaining": 13.5
  },
  "pay": {
   "gross": 6743410,
   "net": 5468030,
   "overtime": 19.5,
   "deductions": 1275380
  }
 },
 {
  "id": "E1124",
  "name": "조준영",
  "gender": "M",
  "dept": "승무1사업소",
  "hq": "운전본부",
  "site": "수도권",
  "job": "운전·승무",
  "position": "차장",
  "grade": 2,
  "duty": "팀원",
  "pattern": "교번근무",
  "status": "재직",
  "hire": "2004-06-01",
  "email": "e1124@nuri.test",
  "base": 5180000,
  "leave": {
   "granted": 25.0,
   "used": 19.5,
   "remaining": 5.5
  },
  "pay": {
   "gross": 6325330,
   "net": 5123740,
   "overtime": 15.0,
   "deductions": 1201590
  }
 },
 {
  "id": "E1528",
  "name": "이현지",
  "gender": "F",
  "dept": "역무3센터",
  "hq": "영업본부",
  "site": "영남권",
  "job": "역무",
  "position": "대리",
  "grade": 4,
  "duty": "팀원",
  "pattern": "교대근무",
  "status": "재직",
  "hire": "2021-05-01",
  "email": "e1528@nuri.test",
  "base": 3150000,
  "leave": {
   "granted": 17.0,
   "used": 8.5,
   "remaining": 8.5
  },
  "pay": {
   "gross": 3931730,
   "net": 3404950,
   "overtime": 6.5,
   "deductions": 526780
  }
 },
 {
  "id": "E1481",
  "name": "황미정",
  "gender": "F",
  "dept": "역무1센터",
  "hq": "영업본부",
  "site": "수도권",
  "job": "역무",
  "position": "대리",
  "grade": 4,
  "duty": "팀원",
  "pattern": "교대근무",
  "status": "재직",
  "hire": "2019-09-01",
  "email": "e1481@nuri.test",
  "base": 3230000,
  "leave": {
   "granted": 18.0,
   "used": 14.5,
   "remaining": 3.5
  },
  "pay": {
   "gross": 4126980,
   "net": 3572630,
   "overtime": 10.0,
   "deductions": 554350
  }
 },
 {
  "id": "E1504",
  "name": "문우진",
  "gender": "M",
  "dept": "차량1사업소",
  "hq": "차량본부",
  "site": "수도권",
  "job": "차량정비",
  "position": "대리",
  "grade": 4,
  "duty": "팀원",
  "pattern": "교대근무",
  "status": "재직",
  "hire": "2020-10-01",
  "email": "e1504@nuri.test",
  "base": 3190000,
  "leave": {
   "granted": 17.0,
   "used": 14.0,
   "remaining": 3.0
  },
  "pay": {
   "gross": 4131810,
   "net": 3576770,
   "overtime": 10.0,
   "deductions": 555040
  }
 },
 {
  "id": "E1691",
  "name": "송영철",
  "gender": "M",
  "dept": "승무2사업소",
  "hq": "운전본부",
  "site": "충청권",
  "job": "운전·승무",
  "position": "사원",
  "grade": 5,
  "duty": "팀원",
  "pattern": "교번근무",
  "status": "재직",
  "hire": "2025-02-01",
  "email": "e1691@nuri.test",
  "base": 2490000,
  "leave": {
   "granted": 15.0,
   "used": 10.0,
   "remaining": 5.0
  },
  "pay": {
   "gross": 3470950,
   "net": 3009200,
   "overtime": 11.0,
   "deductions": 461750
  }
 },
 {
  "id": "E1403",
  "name": "김정수",
  "gender": "M",
  "dept": "통신팀",
  "hq": "기술본부",
  "site": "본사",
  "job": "시설·전기",
  "position": "과장",
  "grade": 3,
  "duty": "팀원",
  "pattern": "일근",
  "status": "휴직",
  "hire": "2016-11-01",
  "email": "e1403@nuri.test",
  "base": 3950000,
  "leave": null,
  "pay": null
 },
 {
  "id": "E1220",
  "name": "김진호",
  "gender": "M",
  "dept": "종합관제팀",
  "hq": "운전본부",
  "site": "본사",
  "job": "운전·승무",
  "position": "차장",
  "grade": 2,
  "duty": "팀원",
  "pattern": "교번근무",
  "status": "재직",
  "hire": "2009-04-01",
  "email": "e1220@nuri.test",
  "base": 4980000,
  "leave": {
   "granted": 23.0,
   "used": 19.5,
   "remaining": 3.5
  },
  "pay": {
   "gross": 6676050,
   "net": 5410680,
   "overtime": 11.5,
   "deductions": 1265370
  }
 },
 {
  "id": "E1100",
  "name": "이성진",
  "gender": "M",
  "dept": "차량1사업소",
  "hq": "차량본부",
  "site": "수도권",
  "job": "차량정비",
  "position": "차장",
  "grade": 2,
  "duty": "팀원",
  "pattern": "교대근무",
  "status": "재직",
  "hire": "2003-01-01",
  "email": "e1100@nuri.test",
  "base": 5220000,
  "leave": {
   "granted": 25.0,
   "used": 16.5,
   "remaining": 8.5
  },
  "pay": {
   "gross": 7322430,
   "net": 5960960,
   "overtime": 21.0,
   "deductions": 1361470
  }
 },
 {
  "id": "E1520",
  "name": "김현정",
  "gender": "F",
  "dept": "운전계획팀",
  "hq": "운전본부",
  "site": "본사",
  "job": "운전·승무",
  "position": "대리",
  "grade": 4,
  "duty": "팀원",
  "pattern": "일근",
  "status": "재직",
  "hire": "2021-04-01",
  "email": "e1520@nuri.test",
  "base": 3150000,
  "leave": {
   "granted": 17.0,
   "used": 4.5,
   "remaining": 12.5
  },
  "pay": null
 },
 {
  "id": "E1031",
  "name": "김영환",
  "gender": "M",
  "dept": "안전총괄팀",
  "hq": "경영지원본부",
  "site": "본사",
  "job": "사무",
  "position": "부장",
  "grade": 1,
  "duty": "팀장",
  "pattern": "일근",
  "status": "재직",
  "hire": "1996-08-01",
  "email": "e1031@nuri.test",
  "base": 6600000,
  "leave": {
   "granted": 25.0,
   "used": 10.0,
   "remaining": 15.0
  },
  "pay": {
   "gross": 7735880,
   "net": 6312950,
   "overtime": 10.5,
   "deductions": 1422930
  }
 },
 {
  "id": "E1417",
  "name": "한민수",
  "gender": "M",
  "dept": "승무3사업소",
  "hq": "운전본부",
  "site": "영남권",
  "job": "운전·승무",
  "position": "과장",
  "grade": 3,
  "duty": "팀원",
  "pattern": "교번근무",
  "status": "재직",
  "hire": "2017-06-01",
  "email": "e1417@nuri.test",
  "base": 3910000,
  "leave": {
   "granted": 19.0,
   "used": 12.5,
   "remaining": 6.5
  },
  "pay": {
   "gross": 5226820,
   "net": 4378950,
   "overtime": 17.5,
   "deductions": 847870
  }
 },
 {
  "id": "E1461",
  "name": "배영길",
  "gender": "M",
  "dept": "신호팀",
  "hq": "기술본부",
  "site": "본사",
  "job": "시설·전기",
  "position": "대리",
  "grade": 4,
  "duty": "팀원",
  "pattern": "일근",
  "status": "재직",
  "hire": "2018-12-01",
  "email": "e1461@nuri.test",
  "base": 3230000,
  "leave": {
   "granted": 18.0,
   "used": 9.0,
   "remaining": 9.0
  },
  "pay": {
   "gross": 3717360,
   "net": 3220840,
   "overtime": 11.0,
   "deductions": 496520
  }
 },
 {
  "id": "E1646",
  "name": "윤성호",
  "gender": "M",
  "dept": "궤도팀",
  "hq": "기술본부",
  "site": "본사",
  "job": "시설·전기",
  "position": "사원",
  "grade": 5,
  "duty": "팀원",
  "pattern": "일근",
  "status": "재직",
  "hire": "2024-05-01",
  "email": "e1646@nuri.test",
  "base": 2530000,
  "leave": {
   "granted": 15.0,
   "used": 7.5,
   "remaining": 7.5
  },
  "pay": {
   "gross": 2967890,
   "net": 2638060,
   "overtime": 12.0,
   "deductions": 329830
  }
 },
 {
  "id": "E1003",
  "name": "송정식",
  "gender": "M",
  "dept": "인사팀",
  "hq": "경영지원본부",
  "site": "본사",
  "job": "사무",
  "position": "부장",
  "grade": 1,
  "duty": "팀장",
  "pattern": "일근",
  "status": "재직",
  "hire": "1991-09-01",
  "email": "e1003@nuri.test",
  "base": 6800000,
  "leave": {
   "granted": 25.0,
   "used": 18.5,
   "remaining": 6.5
  },
  "pay": {
   "gross": 7503340,
   "net": 6114970,
   "overtime": 2.0,
   "deductions": 1388370
  }
 },
 {
  "id": "E1736",
  "name": "김상철",
  "gender": "M",
  "dept": "역무3센터",
  "hq": "영업본부",
  "site": "영남권",
  "job": "역무",
  "position": "사원",
  "grade": 5,
  "duty": "팀원",
  "pattern": "교대근무",
  "status": "재직",
  "hire": "2025-11-01",
  "email": "e1736@nuri.test",
  "base": 2490000,
  "leave": {
   "granted": 15.0,
   "used": 6.0,
   "remaining": 9.0
  },
  "pay": {
   "gross": 3040190,
   "net": 2701740,
   "overtime": 10.0,
   "deductions": 338450
  }
 },
 {
  "id": "E1476",
  "name": "홍예원",
  "gender": "F",
  "dept": "역무3센터",
  "hq": "영업본부",
  "site": "영남권",
  "job": "역무",
  "position": "대리",
  "grade": 4,
  "duty": "팀원",
  "pattern": "교대근무",
  "status": "재직",
  "hire": "2019-07-01",
  "email": "e1476@nuri.test",
  "base": 3230000,
  "leave": {
   "granted": 18.0,
   "used": 14.0,
   "remaining": 4.0
  },
  "pay": {
   "gross": 4164920,
   "net": 3605220,
   "overtime": 12.0,
   "deductions": 559700
  }
 },
 {
  "id": "E1279",
  "name": "김경자",
  "gender": "F",
  "dept": "승무2사업소",
  "hq": "운전본부",
  "site": "충청권",
  "job": "운전·승무",
  "position": "차장",
  "grade": 2,
  "duty": "팀원",
  "pattern": "교번근무",
  "status": "재직",
  "hire": "2011-11-01",
  "email": "e1279@nuri.test",
  "base": 4900000,
  "leave": {
   "granted": 22.0,
   "used": 16.0,
   "remaining": 6.0
  },
  "pay": {
   "gross": 6489890,
   "net": 5256010,
   "overtime": 11.0,
   "deductions": 1233880
  }
 },
 {
  "id": "E1762",
  "name": "이주원",
  "gender": "M",
  "dept": "궤도팀",
  "hq": "기술본부",
  "site": "본사",
  "job": "시설·전기",
  "position": "사원",
  "grade": 5,
  "duty": "팀원",
  "pattern": "일근",
  "status": "재직",
  "hire": "2026-03-01",
  "email": "e1762@nuri.test",
  "base": 2450000,
  "leave": {
   "granted": 8.0,
   "used": 4.0,
   "remaining": 4.0
  },
  "pay": {
   "gross": 2790660,
   "net": 2481950,
   "overtime": 8.0,
   "deductions": 308710
  }
 },
 {
  "id": "E1035",
  "name": "박수빈",
  "gender": "F",
  "dept": "기술계획팀",
  "hq": "기술본부",
  "site": "본사",
  "job": "시설·전기",
  "position": "부장",
  "grade": 1,
  "duty": "팀원",
  "pattern": "일근",
  "status": "퇴직",
  "hire": "1997-02-01",
  "email": "e1035@nuri.test",
  "base": 6560000,
  "leave": null,
  "pay": null
 },
 {
  "id": "E1095",
  "name": "김민수",
  "gender": "M",
  "dept": "역무2센터",
  "hq": "영업본부",
  "site": "충청권",
  "job": "역무",
  "position": "차장",
  "grade": 2,
  "duty": "팀원",
  "pattern": "교대근무",
  "status": "퇴직",
  "hire": "2002-10-01",
  "email": "e1095@nuri.test",
  "base": 5260000,
  "leave": {
   "granted": 25.0,
   "used": 21.0,
   "remaining": 4.0
  },
  "pay": null
 }
];

/** 본부별 재직·휴직 인원 (퇴직 제외) */
export const HEADCOUNT_BY_HQ: Record<string, number> = {
 "운전본부": 234,
 "영업본부": 198,
 "경영지원본부": 118,
 "차량본부": 120,
 "기술본부": 116
};

/** 2026-10 급여 본부별 합계 */
export const PAYROLL_2026_10: PayrollByHq[] = [
 {
  "hq": "운전본부",
  "people": 232,
  "gross": 1165827540,
  "net": 975944700,
  "overtime": 3134.0
 },
 {
  "hq": "영업본부",
  "people": 198,
  "gross": 963595120,
  "net": 811154410,
  "overtime": 2393.5
 },
 {
  "hq": "경영지원본부",
  "people": 115,
  "gross": 564858690,
  "net": 476293410,
  "overtime": 898.0
 },
 {
  "hq": "차량본부",
  "people": 118,
  "gross": 599986950,
  "net": 501289350,
  "overtime": 1525.0
 },
 {
  "hq": "기술본부",
  "people": 114,
  "gross": 539345790,
  "net": 456384240,
  "overtime": 1363.5
 }
];

export const REGULATIONS: Regulation[] = [
 {
  "id": "r01",
  "name": "복지후생 규정",
  "tier": "핵심",
  "category": "기타 복리후생",
  "effective": "2014-08-29",
  "chunks": 39,
  "searchable": 37,
  "file": "hwp"
 },
 {
  "id": "r02",
  "name": "복지후생규정 시행세칙",
  "tier": "핵심",
  "category": "기타 복리후생",
  "effective": "2025-12-31",
  "chunks": 30,
  "searchable": 28,
  "file": "pdf"
 },
 {
  "id": "r03",
  "name": "취업규칙",
  "tier": "핵심",
  "category": "근태관리",
  "effective": "2026-07-28",
  "chunks": 69,
  "searchable": 66,
  "file": "pdf"
 },
 {
  "id": "r04",
  "name": "유연근무제 운영세칙",
  "tier": "핵심",
  "category": "근태관리",
  "effective": "2026-09-18",
  "chunks": 45,
  "searchable": 38,
  "file": "pdf"
 },
 {
  "id": "r05",
  "name": "여비및시험수당지급세칙",
  "tier": "핵심",
  "category": "출장",
  "effective": "2026-06-11",
  "chunks": 35,
  "searchable": 32,
  "file": "pdf"
 },
 {
  "id": "r06",
  "name": "겸직허가 운영 내규",
  "tier": "핵심",
  "category": "공통",
  "effective": "2026-08-01",
  "chunks": 11,
  "searchable": 1,
  "file": "pdf"
 },
 {
  "id": "r07",
  "name": "보수규정",
  "tier": "핵심",
  "category": "수당",
  "effective": "2026-07-27",
  "chunks": 53,
  "searchable": 52,
  "file": "pdf"
 },
 {
  "id": "r08",
  "name": "보수규정 시행세칙",
  "tier": "핵심",
  "category": "수당",
  "effective": "2026-07-27",
  "chunks": 78,
  "searchable": 70,
  "file": "pdf"
 },
 {
  "id": "r09",
  "name": "퇴직급여 지급 규정",
  "tier": "핵심",
  "category": "생애이벤트-휴직·복직·퇴직",
  "effective": "2025-12-30",
  "chunks": 16,
  "searchable": 15,
  "file": "pdf"
 },
 {
  "id": "r10",
  "name": "퇴직급여 지급 규정 시행세칙",
  "tier": "핵심",
  "category": "생애이벤트-휴직·복직·퇴직",
  "effective": "2023-01-03",
  "chunks": 25,
  "searchable": 14,
  "file": "hwp"
 },
 {
  "id": "r11",
  "name": "임금피크제 운영 내규",
  "tier": "핵심",
  "category": "생애이벤트-휴직·복직·퇴직",
  "effective": "2025-12-12",
  "chunks": 19,
  "searchable": 18,
  "file": "pdf"
 },
 {
  "id": "r12",
  "name": "교육훈련규정",
  "tier": "핵심",
  "category": "교육",
  "effective": "2024-01-01",
  "chunks": 45,
  "searchable": 38,
  "file": "hwp"
 },
 {
  "id": "r13",
  "name": "인사규정",
  "tier": "핵심",
  "category": "공통",
  "effective": "2026-01-30",
  "chunks": 62,
  "searchable": 59,
  "file": "pdf"
 },
 {
  "id": "r14",
  "name": "인사규정 시행세칙",
  "tier": "핵심",
  "category": "공통",
  "effective": "2026-08-21",
  "chunks": 191,
  "searchable": 138,
  "file": "pdf"
 },
 {
  "id": "r15",
  "name": "직원 전보제한 운영 내규",
  "tier": "핵심",
  "category": "공통",
  "effective": "2025-02-01",
  "chunks": 23,
  "searchable": 22,
  "file": "hwp"
 },
 {
  "id": "r16",
  "name": "철도공사 기간제근로자운영내규",
  "tier": "핵심",
  "category": "공통",
  "effective": "2026-08-24",
  "chunks": 5,
  "searchable": 2,
  "file": "pdf"
 },
 {
  "id": "r17",
  "name": "당직 및 비상근무 규정",
  "tier": "보조",
  "category": "근태관리",
  "effective": "2020-11-02",
  "chunks": 31,
  "searchable": 24,
  "file": "hwp"
 },
 {
  "id": "r18",
  "name": "임원의 복무에 관한 지침",
  "tier": "보조",
  "category": "공통",
  "effective": "2026-05-27",
  "chunks": 15,
  "searchable": 14,
  "file": "hwp"
 },
 {
  "id": "r19",
  "name": "공무국외출장 및 해외근무직원 관리 규정",
  "tier": "보조",
  "category": "출장",
  "effective": "2026-10-06",
  "chunks": 49,
  "searchable": 44,
  "file": "pdf"
 },
 {
  "id": "r20",
  "name": "공무국외출장 시행세칙",
  "tier": "보조",
  "category": "출장",
  "effective": "2026-01-15",
  "chunks": 25,
  "searchable": 17,
  "file": "pdf"
 },
 {
  "id": "r21",
  "name": "국외훈련 시행세칙",
  "tier": "보조",
  "category": "교육",
  "effective": "2024-01-01",
  "chunks": 50,
  "searchable": 44,
  "file": "hwp"
 },
 {
  "id": "r22",
  "name": "1급 승진임용내규",
  "tier": "보조",
  "category": "생애이벤트-입사·승진",
  "effective": "2025-03-01",
  "chunks": 13,
  "searchable": 11,
  "file": "hwp"
 },
 {
  "id": "r23",
  "name": "2급 승진임용내규",
  "tier": "보조",
  "category": "생애이벤트-입사·승진",
  "effective": "2025-03-01",
  "chunks": 17,
  "searchable": 16,
  "file": "hwp"
 },
 {
  "id": "r24",
  "name": "4급 시험승진 임용내규",
  "tier": "보조",
  "category": "생애이벤트-입사·승진",
  "effective": "2023-05-01",
  "chunks": 15,
  "searchable": 14,
  "file": "hwp"
 },
 {
  "id": "r25",
  "name": "특별승진임용내규",
  "tier": "보조",
  "category": "생애이벤트-입사·승진",
  "effective": "2022-10-11",
  "chunks": 10,
  "searchable": 9,
  "file": "hwp"
 },
 {
  "id": "r26",
  "name": "채용 시행세칙",
  "tier": "보조",
  "category": "생애이벤트-입사·승진",
  "effective": "2026-08-21",
  "chunks": 49,
  "searchable": 44,
  "file": "pdf"
 },
 {
  "id": "r27",
  "name": "전문직직원 운영 세칙",
  "tier": "보조",
  "category": "공통",
  "effective": "2022-08-19",
  "chunks": 44,
  "searchable": 41,
  "file": "hwp"
 },
 {
  "id": "r28",
  "name": "특정직직원운영내규",
  "tier": "보조",
  "category": "공통",
  "effective": "2014-04-24",
  "chunks": 10,
  "searchable": 9,
  "file": "hwp"
 },
 {
  "id": "r29",
  "name": "철도직무관리내규",
  "tier": "보조",
  "category": "공통",
  "effective": "2025-12-31",
  "chunks": 23,
  "searchable": 18,
  "file": "hwp"
 },
 {
  "id": "r30",
  "name": "직제규정",
  "tier": "보조",
  "category": "공통",
  "effective": "2026-10-27",
  "chunks": 14,
  "searchable": 10,
  "file": "pdf"
 },
 {
  "id": "r31",
  "name": "직제규정 시행세칙",
  "tier": "보조",
  "category": "공통",
  "effective": "2026-09-29",
  "chunks": 73,
  "searchable": 71,
  "file": "pdf"
 },
 {
  "id": "r32",
  "name": "위임전결규정",
  "tier": "보조",
  "category": "공통",
  "effective": "2026-09-30",
  "chunks": 36,
  "searchable": 34,
  "file": "pdf"
 },
 {
  "id": "r33",
  "name": "문서관리 규정",
  "tier": "보조",
  "category": "공통",
  "effective": "2015-02-27",
  "chunks": 87,
  "searchable": 74,
  "file": "hwp"
 }
];
