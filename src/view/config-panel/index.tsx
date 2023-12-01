import { Card, Input, InputNumber, Select, Switch } from '@douyinfe/semi-ui';
import { observer } from 'mobx-react';
import { useEditorStore, type EditorStore } from '../../store/element';
import { elementVisualConfig } from '../../config/visual';
import { type RefObject, useEffect, useState } from 'react';

import type { Editor } from '../../editor/editor';
import type { CommonMarkVisual } from '../../typings/mark';
import { AngleInput } from './components/AngleInput';
import { Points } from './components/Points';
import { ConfigWrapper } from './components/ConfigWrapper';

import './index.less';

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
          currentElement.updateVisuals(visual.channel as keyof CommonMarkVisual, value);
          editorStore.updateElement(currentElement.getViewElement());
          editor.render();
        }
      };
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const value = (formValues as any)[visual.channel];
      switch (visual.type) {
        case 'string':
          return (
            <ConfigWrapper editorRef={editorRef} channel={visual.channel}>
              <Input value={value} onChange={onChange} />
            </ConfigWrapper>
          );
        case 'number':
          return (
            <ConfigWrapper editorRef={editorRef} channel={visual.channel}>
              <InputNumber
                value={value}
                onChange={onChange}
                step={visual?.options?.step}
                max={visual?.options?.max}
                min={visual?.options?.min}
              />
            </ConfigWrapper>
          );
        case 'angle':
          return (
            <ConfigWrapper editorRef={editorRef} channel={visual.channel}>
              <AngleInput key={visual.channel} config={visual} value={value} onChange={onChange}></AngleInput>
            </ConfigWrapper>
          );
        case 'points':
          return <Points key={visual.channel} config={visual} value={value} onChange={onChange}></Points>;
        case 'color':
          return (
            <ConfigWrapper editorRef={editorRef} channel={visual.channel}>
              <Input value={value} onChange={onChange} />
            </ConfigWrapper>
          );
        case 'boolean':
          return (
            <ConfigWrapper editorRef={editorRef} channel={visual.channel}>
              <Switch checked={value} onChange={onChange} />
            </ConfigWrapper>
          );
        case 'select':
          return (
            <ConfigWrapper editorRef={editorRef} channel={visual.channel}>
              <Select value={value} onChange={onChange}>
                {visual.options?.options?.map(({ label, value }: { label: string; value: string }) => (
                  <Select.Option key={value} value={value}>
                    {label}
                  </Select.Option>
                ))}
              </Select>
            </ConfigWrapper>
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
    <Card className="config-panel" title="Config Panel" style={{ width: '100%', height: '100%' }}>
      {editorStore.currentElement ? generateVisuals(editorStore, editorRef, formValues, setFormValues) : null}
      {/* {currentElement ? generateVisuals(currentElement, editorStore) : null} */}
    </Card>
  );
});
