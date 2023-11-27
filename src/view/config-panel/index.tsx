import { Card, Input, InputNumber, Select, Switch } from '@douyinfe/semi-ui';
import { observer } from 'mobx-react';
import { useEditorStore, type EditorStore } from '../../store/element';
import { elementVisualConfig } from '../../config/visual';
import { type RefObject, useEffect, useState } from 'react';

import './index.css';
import type { Editor } from '../../editor/editor';
import type { CommonMarkVisual } from '../../typings/mark';
import { NumberInput } from './components/NumberInput';
import { Points } from './components/Points';

const generateVisuals = (
  editorStore: EditorStore,
  editorRef: RefObject<Editor>,
  formValues: CommonMarkVisual,
  setFormValues: (v: object) => void
) => {
  const currentViewElement = editorStore.currentElement!;
  const visualConfig = elementVisualConfig[currentViewElement.type];
  const editor = editorRef.current!;
  if (visualConfig) {
    return visualConfig.map(visual => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const onChange = (nextValue: any) => {
        let value = nextValue;
        if (visual.handler) {
          value = visual.handler(value);
        }

        setFormValues({
          ...formValues,
          [visual.channel]: value
        });

        const currentElement = editor.getElementById(currentViewElement.id);
        if (currentElement) {
          currentElement.updateVisuals(visual.channel as keyof CommonMarkVisual, value, visual.type);
          editorStore.updateElement(currentElement.getViewElement());
          editor.render();
        }
      };
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const value = (formValues as any)[visual.channel];
      switch (visual.type) {
        case 'string':
          return (
            <div className="config-panel-entry" key={visual.channel}>
              <span className="config-panel-entry-label">{visual.channel}:</span>
              <div className="config-panel-entry-item">
                <Input
                  // defaultValue={value}
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  value={value}
                  onChange={onChange}
                />
              </div>
            </div>
          );
        case 'number':
          return (
            <div className="config-panel-entry" key={visual.channel}>
              <span className="config-panel-entry-label">{visual.channel}:</span>
              <InputNumber
                // defaultValue={value}
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                value={value}
                onChange={onChange}
                step={visual?.options?.step}
                max={visual?.options?.max}
                min={visual?.options?.min}
              />
            </div>
          );
        case 'angle':
          return <NumberInput key={visual.channel} config={visual} value={value} onChange={onChange}></NumberInput>;
        case 'points':
          return <Points key={visual.channel} config={visual} value={value} onChange={onChange}></Points>;
        case 'color':
          return (
            <div className="config-panel-entry" key={visual.channel}>
              <span className="config-panel-entry-label">{visual.channel}:</span>
              <div className="config-panel-entry-item">
                <Input
                  // defaultValue={value}
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  value={value}
                  onChange={onChange}
                />
              </div>
            </div>
          );
        case 'boolean':
          return (
            <div className="config-panel-entry" key={visual.channel}>
              <span className="config-panel-entry-label">{visual.channel}:</span>
              <div className="config-panel-entry-item">
                <Switch
                  // defaultChecked={value}
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  checked={value}
                  onChange={onChange}
                />
              </div>
            </div>
          );
        case 'select':
          return (
            <div className="config-panel-entry" key={visual.channel}>
              <span className="config-panel-entry-label">{visual.channel}:</span>
              <div className="config-panel-entry-item">
                <Select
                  // defaultChecked={value}
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  value={value}
                  onChange={onChange}
                >
                  {visual.options?.options?.map(({ label, value }: { label: string; value: string }) => (
                    <Select.Option key={value} value={value}>
                      {label}
                    </Select.Option>
                  ))}
                </Select>
              </div>
            </div>
          );
      }
      return <div style={{ color: 'red' }}>control type [{visual.type}] not exist</div>;
    });
  }
  return null;
};

export const ConfigPanel = observer(({ editorRef }: { editorRef: RefObject<Editor> }) => {
  const editorStore = useEditorStore();
  const [formValues, setFormValues] = useState<CommonMarkVisual>({});

  useEffect(() => {
    const currentElement = editorStore.currentElement;
    if (!currentElement) {
      return;
    }
    const visuals = currentElement?.visuals;

    setFormValues({
      ...visuals
    });
  }, [editorStore.currentElement]);

  return (
    <Card title="Config Panel" style={{ width: '100%', height: '100%' }}>
      {editorStore.currentElement ? generateVisuals(editorStore, editorRef, formValues, setFormValues) : null}
      {/* {currentElement ? generateVisuals(currentElement, editorStore) : null} */}
    </Card>
  );
});
