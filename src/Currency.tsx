import React, { ChangeEvent } from 'react';
import { ResponseDataType } from './App';

type CurrencyType = {
  options: string[];
  selectedCurrency: string | undefined;
  onChangeCurrency: (e: ChangeEvent<HTMLSelectElement>) => void;
  onChangeInput: (e: ChangeEvent<HTMLInputElement>) => void;
  amount: any;
};

export const Currency = (props: CurrencyType) => {
  return (
    <div>
      <input type="number" className="input" value={props.amount} onChange={props.onChangeInput} />
      <select className="select" value={props.selectedCurrency} onChange={props.onChangeCurrency}>
        {props.options.map((option, index) => (
          <option key={index} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
};
