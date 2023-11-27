import { memo, useCallback, useEffect, useState } from 'react';
import { InputNumber } from '@douyinfe/semi-ui';
import type { IVisualConfig } from '../../../typings';

interface Props {
  config: IVisualConfig;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onChange: (value: any) => any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  value: number;
}

export const NumberInput = memo((props: Props) => {
  const { config, value: originValue, onChange } = props;
  const [value, setValue] = useState<number>();

  const radianToAngle = useCallback((radian: number): number => {
    return Math.floor((180 / Math.PI) * radian);
  }, []);

  useEffect(() => {
    setValue(radianToAngle(originValue));
  }, [originValue, radianToAngle]);

  const angleToRadian = useCallback((angle: number): number => {
    return angle * (Math.PI / 180);
  }, []);

  const handleChange = useCallback(
    (value: number) => {
      setValue(value);
      const radianValue = angleToRadian(value);
      onChange(radianValue);
    },
    [angleToRadian, onChange]
  );

  return (
    <div className="config-panel-entry" key={config.channel}>
      <span className="config-panel-entry-label">{config.channel}:</span>
      <div className="config-panel-entry-item">
        <InputNumber
          // defaultValue={value}
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          value={value}
          onChange={handleChange}
          step={config?.options?.step}
          max={config?.options?.max}
          min={config?.options?.min}
        />
      </div>
    </div>
  );
});
