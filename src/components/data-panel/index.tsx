import { Fragment, useState } from 'react';
import { IconUpload } from '@douyinfe/semi-icons';
import { Button, Card, Divider, Upload } from '@douyinfe/semi-ui';
import { DataSet, DataView, csvParser } from '@visactor/vdataset';
import { v4 as uuid } from 'uuid';
import type { DataField } from '../../typings';

import './index.css';

const DataDescription = (props: { dataElement: DataElement }) => {
  return (
    <div>
      {props.dataElement.fields.map(field => {
        switch (field.type) {
          case 'number':
            return (
              <div key={field.key}>
                <span className="data-panel-entry-label">{field.key}</span>
                <span className="data-panel-entry-description">{`[${field.range[0]}, ${field.range[1]}]`}</span>
              </div>
            );
          case 'ordinal':
            return (
              <div key={field.key}>
                <span className="data-panel-entry-label">{field.key}</span>
                <span className="data-panel-entry-description">{`${field.count} values`}</span>
              </div>
            );
        }
      })}
    </div>
  );
};

class DataElement {
  readonly id = uuid();

  private values: any[];

  fields: DataField[];

  constructor(values: any[]) {
    this.values = values;
    this.fields = this.parseFields(values);
  }

  private parseFields(values: any[]): DataField[] {
    return Object.keys(values[0] ?? {}).map((field: string) => {
      const range = Array.from(new Set(values.map(value => value[field])));
      const numberRange = range.map(value => Number.parseFloat(value));
      if (numberRange.every(value => !isNaN(value))) {
        return {
          key: field,
          type: 'number',
          range: [Math.min.apply(null, numberRange as number[]), Math.max.apply(null, numberRange as number[])]
        };
      }
      return {
        key: field,
        type: 'ordinal',
        range,
        count: range.length
      };
    });
  }
}

const mockData = [
  {
    State: 'WY',
    Age: 'Under 5 Years',
    Population: '25635'
  },
  {
    State: 'WY',
    Age: '5 to 13 Years',
    Population: '1890'
  },
  {
    State: 'WY',
    Age: '14 to 17 Years',
    Population: '9314'
  },
  {
    State: 'DC',
    Age: 'Under 5 Years',
    Population: '30352'
  },
  {
    State: 'DC',
    Age: '5 to 13 Years',
    Population: '20439'
  },
  {
    State: 'DC',
    Age: '14 to 17 Years',
    Population: '10225'
  },
  {
    State: 'VT',
    Age: 'Under 5 Years',
    Population: '38253'
  },
  {
    State: 'VT',
    Age: '5 to 13 Years',
    Population: '42538'
  },
  {
    State: 'VT',
    Age: '14 to 17 Years',
    Population: '15757'
  },
  {
    State: 'ND',
    Age: 'Under 5 Years',
    Population: '51896'
  },
  {
    State: 'ND',
    Age: '5 to 13 Years',
    Population: '67358'
  },
  {
    State: 'ND',
    Age: '14 to 17 Years',
    Population: '18794'
  }
];

export const DataPanel = () => {
  const [dataElements, setDataElements] = useState<DataElement[]>([new DataElement(mockData)]);

  return (
    <Card title="Data Panel" style={{ width: '100%', height: 300, overflowY: 'scroll' }}>
      <Upload
        action=""
        accept=".csv"
        limit={1}
        renderFileItem={() => null}
        onFileChange={async files => {
          const reader = new FileReader();
          reader.readAsText(files[0], 'UTF-8');
          reader.onload = event => {
            const content = event?.target?.result ?? '';
            const data = csvParser(content, {}, new DataView(new DataSet())) ?? [];
            const element = new DataElement(data);
            setDataElements(dataElements.concat(element));
          };
        }}
      >
        <Button icon={<IconUpload />}>点击上传数据</Button>
      </Upload>
      <Divider margin="12px" />
      {dataElements.map(dataElement => (
        <Fragment key={dataElement.id}>
          <DataDescription dataElement={dataElement} />
          <Divider margin="12px" />
        </Fragment>
      ))}
    </Card>
  );
};
