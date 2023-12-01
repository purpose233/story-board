import React, { memo, useCallback, useEffect, useState } from 'react';
import { InputNumber } from '@douyinfe/semi-ui';
import type { IVisualConfig } from '../../../typings';
import type { InputNumberProps } from '@douyinfe/semi-ui/lib/es/inputNumber';

interface Props extends InputNumberProps {
  config: IVisualConfig;
  onChange: (value: number | string, e?: React.ChangeEvent) => void;
  value: number;
}

export const AngleInput = memo((props: Props) => {
  const { config, value: originValue, onChange } = props;
  const [value, setValue] = useState<number | string>();

  const radianToAngle = useCallback((radian: number): number => {
    return Math.floor((180 / Math.PI) * radian);
  }, []);

  useEffect(() => {
    setValue(radianToAngle(originValue));
  }, [originValue, radianToAngle]);

  const angleToRadian = useCallback((angle: number | string): number => {
    return (angle as number) * (Math.PI / 180);
  }, []);

  const handleChange = useCallback(
    (value: number | string) => {
      setValue(value);
      const radianValue = angleToRadian(value);
      onChange(radianValue);
    },
    [angleToRadian, onChange]
  );

  return (
    <InputNumber
      value={value}
      onChange={handleChange}
      step={config?.options?.step}
      max={config?.options?.max}
      min={config?.options?.min}
    />
  );
});
