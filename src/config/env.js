import {DEV_BACKEND_URL, PROD_BACKEND_URL} from '@env';
console.log(PROD_BACKEND_URL)
const devEnvironmentVariables = {
  BACKEND_URL: DEV_BACKEND_URL,
};

const prodEnvironmentVariables = {
  BACKEND_URL: PROD_BACKEND_URL,
};

export default __DEV__ ? devEnvironmentVariables : prodEnvironmentVariables;
