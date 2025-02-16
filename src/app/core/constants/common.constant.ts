export const MY_FORMATS = {
  parse: {
    dateInput: 'LL',
  },
  display: {
    dateInput: 'DD/MM/YYYY',
    monthYearLabel: 'YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'YYYY',
  },
  PRICE_6: '1.6-6',
  PRICE_2: '1.2-2',
};

export const NETWORK = [
  {
    value: 1,
    label: 'Fabric',
    icon: '/assets/images/icons/fabric.png',
  },
  {
    value: 2,
    label: 'Cosmos',
    icon: '/assets/images/icons/chain_cosmos.svg',
  },
];

export const DATEFORMAT = {
  DATETIME_UTC: 'yyyy-MM-dd HH:mm:ss',
  DATE_ONLY: 'dd/MM/yyyy',
};

export const NUMBER_CONVERT = 1000000; //10^6 satoshi unit

export const PAGE_EVENT = {
  LENGTH: 0,
  PAGE_SIZE: 5,
  PAGE_INDEX: 0,
  PREVIOUS_PAGE_INDEX: 0,
  LENGTH_DEFAULT: 500,
};

export const DATE_TIME_WITH_MILLISECOND = 24 * 60 * 60;

export const VALIDATOR_AVATAR_DF = 'https://validator-logos.s3.ap-southeast-1.amazonaws.com/validator-default.svg';

export const TIME_OUT_CALL_API = 5000;

export const NUM_BLOCK = 10000;

export const CHART_RANGE = {
  M_60: '60m',
  H_24: '24h',
  D_30: '30d',
  MONTH_12: '12M',
};

export const LENGTH_CHARACTER = {
  ADDRESS: 43,
  CONTRACT: 63,
  TRANSACTION: 64
};

export const NULL_ADDRESS = "0".repeat(LENGTH_CHARACTER.ADDRESS);

export const TOKEN_ID_GET_PRICE = {
  AURA: 'aura-network',
  BTC: 'bitcoin'
};

export const LIST_TYPE_CONTRACT_ADDRESS = ['revoke_all', 'approve_all', 'revoke', 'approve'];

export enum MEDIA_TYPE {
  IMG = 'img',
  VIDEO = 'video',
  _3D = '3d',
  AUDIO = 'audio',
}