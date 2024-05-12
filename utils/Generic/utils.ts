export const isObjectEmpty = (obj: object | any) => {
  return Object.keys(obj).length === 0;
}

export const ImageFetch: any = {
  CAR: require('../../assets/images/CARL.png'),
  RIC: require('../../assets/images/RICH.png'),
  COL: require('../../assets/images/COLL.png'),
  SYD: require('../../assets/images/SYD.png'),
  ESS: require('../../assets/images/ESS.png'),
  HAW: require('../../assets/images/HAW.png'),
  GWS: require('../../assets/images/GWS.png'),
  NOR: require('../../assets/images/NMFC.png'),
  GEL: require('../../assets/images/GEEL.png'),
  STK: require('../../assets/images/STK.png'),
  GCS: require('../../assets/images/GCFC.png'),
  ADE: require('../../assets/images/ADEL.png'),
  MEL: require('../../assets/images/MELB.png'),
  WBD: require('../../assets/images/WB.png'),
  POR: require('../../assets/images/PORT.png'),
  WCE: require('../../assets/images/WCE.png'),
  FRE: require('../../assets/images/FRE.png'),
  BRI: require('../../assets/images/BL.png')
}


export const abbreviateTeam = (teamName: string) => {

  switch (teamName) {
    case 'Richmond':
      return 'RIC'
    case 'Carlton':
      return 'CAR'
    case 'Sydney':
      return 'SYD'
    case 'Collingwood':
      return 'COL'
    case 'Hawthorn':
      return 'HAW'
    case 'Essendon':
      return 'ESS'
    case 'Brisbane Lions':
      return 'BRI'
    case 'Fremantle':
      return 'FRE'
    case 'St Kilda':
      return 'STK'
    case 'Geelong':
      return 'GEL'
    case 'Adelaide':
      return 'ADE'
    case 'Gold Coast':
      return 'GCS'
    case 'North Melbourne':
      return 'NOR'
    case 'Greater Western Sydney':
      return 'GWS'
    case 'Western Bulldogs':
      return 'WBD'
    case 'Melbourne':
      return 'MEL'
    case 'West Coast':
      return 'WCE'
    case 'Port Adelaide':
      return 'POR'

  }
}

export const isEmailValid = (email: string) => {
  const validRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
  return validRegex.test(email)
}

export const convertUnixToLocalTime = (unixTimeCode: number) => {
  //* Keep these incase we need UTC test comparisons
  // const formattedUTCTime = date.toUTCString();
  // const formattedLocalTime = date.toLocaleString();

  const date = new Date(unixTimeCode * 1000);

  const displayOptions: any = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    hour12: false,
  };


  const formattedLocalTime = date.toLocaleString('en-AU', displayOptions);
  const splitData = formattedLocalTime.replace(" at ", ",").split(',');

  return {
    matchDay: splitData[0],
    matchDate: splitData[1],
    matchTime: splitData[2],
  }
}

