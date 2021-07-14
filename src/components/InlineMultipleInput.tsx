import React, { useState } from 'react';
import { Input } from 'antd';


type Currency = 'rmb' | 'dollar';

interface InputValue {
  a: string;
  b: string;
  c: string;
}

interface MultipleInputProps {
  value?: InputValue;
  onChange?: (value: InputValue) => void;
  placehoderList?: string[];
  inline?: Boolean;
}

const InlineMultipleInput: React.FC<MultipleInputProps> = ({ value = {}, onChange, placehoderList = [], inline = 'false'}) => {
  const [a, setA] = useState<string>('');
  const [b, setB] = useState<string>('');
  const [c, setC] = useState<string>('');


  const triggerChange = (changedValue: { a?: string, b?: string, c?: string }) => {
    onChange?.({ a, b, c, ...value, ...changedValue });
  };

  const onChangeGenerator = (v: number) => {
    return (e: React.ChangeEvent<HTMLInputElement>) => {
      if (v === 0) {
        setA(e.target.value);
        triggerChange({ a: e.target.value })
      }
      if (v === 1) {
        setB(e.target.value);
        triggerChange({ b: e.target.value })
      }
      if (v === 2) {
        setC(e.target.value);
        triggerChange({ c: e.target.value })
      }
    };
  }

  return (
    <span>
      <Input
        type="text"
        value={value.a || a}
        onChange={onChangeGenerator(0)}
        style={{ width: 90, marginRight: 10 }}
        placeholder={placehoderList[0] ?? null}
      />
      <Input
        type="text"
        value={value.b || b}
        onChange={onChangeGenerator(1)}
        style={{ width: 90, marginRight: 10 }}
        placeholder={placehoderList[1] ?? null}
      />
      <Input
        type="text"
        value={value.c || c}
        onChange={onChangeGenerator(2)}
        style={{ width: 90 }}
        placeholder={placehoderList[2] ?? null}
      />
    </span>
  );
};

export default InlineMultipleInput;