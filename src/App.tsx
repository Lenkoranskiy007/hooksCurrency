import React, { ChangeEvent, useEffect, useState } from 'react';
import axios from 'axios';
import { Currency } from './Currency';
import './index.scss';
import Box from '@material-ui/core/Box/Box';
import { CircularProgress } from '@material-ui/core';

export type ResponseDataType = {
  base: string;
  disclaimer: string;
  license: string;
  rates: {} | any;
  timestamp: number;
};

type ResponseType = {
  data: ResponseDataType;
};

function App() {
  const [options, setOptions] = useState<string[]>([]);
  const [oneCurrency, setOneCurrency] = useState<string>();
  const [twoCurrency, setTwoCurrency] = useState<string>();
  const [changeRate, setChangeRate] = useState<number>();
  const [amount, setAmount] = useState<number | any>(1);
  const [amountInFromCurrency, setAmountInFromCurrency] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  let toAmount, fromAmount;
  if (amountInFromCurrency) {
    fromAmount = amount;
    toAmount = changeRate && amount * changeRate;
  } else {
    toAmount = amount;
    fromAmount = changeRate && amount / changeRate;
  }

  useEffect(() => {
    setIsLoading(true);
    axios
      .get('https://openexchangerates.org/api/latest.json?app_id=02a319ef9b3d4607aef242f676e6752e')
      .then(
        //@ts-ignore
        (res: ResponseType) => {
          const firstCurrency = Object.keys(res.data.rates)[0];
          setOptions([res.data.base, ...Object.keys(res.data.rates)]);
          setOneCurrency(res.data.base);
          setTwoCurrency(firstCurrency);
          setChangeRate(res.data.rates[firstCurrency]);
          setIsLoading(false);
        },
      );
  }, []);

  useEffect(() => {
    if (oneCurrency != null && twoCurrency != null) {
      axios(
        `https://openexchangerates.org/api/latest.json?app_id=02a319ef9b3d4607aef242f676e6752e&base=${oneCurrency}&symbols=${twoCurrency}`,
      ) //@ts-ignore
        .then((res) => setChangeRate(res.data.rates[twoCurrency]))
        .catch((res) => {
          if (!res.ok) {
            alert(
              'Changing the API `base` currency is available for Developer, Enterprise and Unlimited plan clients. Please upgrade, or contact support@openexchangerates.org with any questions.',
            );
          }
        });
    }
  }, [oneCurrency, twoCurrency]);

  function handleOneChange(e: ChangeEvent<HTMLInputElement>) {
    setAmount(e.target.value);
    setAmountInFromCurrency(true);
  }

  function handleTwoChange(e: ChangeEvent<HTMLInputElement>) {
    setAmount(e.target.value);
    setAmountInFromCurrency(false);
  }

  return (
    <>
      <div className="wrapper">
        <div className="content">
          <h1>Курс валют</h1>
          {isLoading && <CircularProgress />}
          <Currency
            //@ts-ignore
            options={options}
            selectedCurrency={oneCurrency}
            onChangeCurrency={(e: ChangeEvent<HTMLSelectElement>) => setOneCurrency(e.target.value)}
            onChangeInput={handleOneChange}
            amount={fromAmount}
          />
          <hr />
          <Currency
            //@ts-ignore
            options={options}
            selectedCurrency={twoCurrency}
            onChangeCurrency={(e: ChangeEvent<HTMLSelectElement>) => setTwoCurrency(e.target.value)}
            onChangeInput={handleTwoChange}
            amount={toAmount}
          />
        </div>
      </div>
    </>
  );
}

// Компонент Loader
export function CircularIndeterminate() {
  return (
    <Box className="circular" sx={{ display: 'flex' }}>
      <CircularProgress />
    </Box>
  );
}

export default App;
