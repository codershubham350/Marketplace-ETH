import useSWR from "swr";

const URL =
  "https://api.coingecko.com/api/v3/coins/ethereum?localization=false&tickers=false&community_data=false&developer_data=false&sparkline=false";
const COURSE_PRICE = 15;

const fetcher = async (url) => {
  const res = await fetch(url);
  const jsonRes = await res.json();
  return jsonRes?.market_data?.current_price?.usd ?? null;
};
export const useEthPrice = () => {
  const { data, ...rest } = useSWR(URL, (url) => fetcher(url), {
    refreshInterval: 10000,
  });

  const perItem = (data && COURSE_PRICE / parseInt(data))?.toFixed(6) ?? null;

  return { eth: { data, perItem, ...rest } };
};
