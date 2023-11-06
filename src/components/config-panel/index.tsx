import { Card, Input, InputNumber, Switch } from '@douyinfe/semi-ui';
import { observer } from 'mobx-react';
import { useEditorStore, type EditorStore } from '../../store/element';
import { elementVisualConfig } from '../../config/visual';
import { type RefObject, useEffect, useState } from 'react'

import './index.css';
import type { Editor } from '../../editor/editor';
import type { CommonMarkVisual } from '../../typings/mark';

const generateVisuals = (
    editorStore: EditorStore,
    editorRef: RefObject<Editor>,
    formValues: CommonMarkVisual,
    setFormValues: (v: object) => void
  ) => {
  const currentViewElement = editorStore.currentElement!
  const visualConfig = elementVisualConfig[currentViewElement.type];
  const editor = editorRef.current!
  if (visualConfig) {
    return visualConfig.map(visual => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const onChange = (nextValue: any) => {
        setFormValues({
          ...formValues,
          [visual.channel]: nextValue
        })
        
        const currentElement = editor.getElementById(currentViewElement.id)
        if (currentElement) {
          currentElement.updateVisuals(visual.channel as keyof CommonMarkVisual, nextValue)
          editorStore.updateElement(currentElement.getViewElement());
          editor.render()
        }
      }
      switch (visual.type) {
        case 'string':
          return (
            <div className="config-panel-entry" key={visual.channel}>
              <span className="config-panel-entry-label">{visual.channel}:</span>
              <Input
                // defaultValue={value}
                value={(formValues as any)[visual.channel]}
                onChange={onChange}
                style={{ width: 180 }}
              />
            </div>
          );
        case 'number':
          return (
            <div className="config-panel-entry" key={visual.channel}>
              <span className="config-panel-entry-label">{visual.channel}:</span>
              <InputNumber
                // defaultValue={value}
                value={(formValues as any)[visual.channel]}
                onChange={onChange}
                step={visual?.options?.step}
                max={visual?.options?.max}
                min={visual?.options?.min}
                style={{ width: 180 }}
              />
            </div>
          );
        case 'color':
          return (
            <div className="config-panel-entry" key={visual.channel}>
              <span className="config-panel-entry-label">{visual.channel}:</span>
              <Input
                // defaultValue={value}
                value={(formValues as any)[visual.channel]}
                onChange={onChange}
                style={{ width: 180 }}
              />
            </div>
          );
        case 'boolean':
          return (
            <div className="config-panel-entry" key={visual.channel}>
              <span className="config-panel-entry-label">{visual.channel}:</span>
              <Switch
                // defaultChecked={value}
                checked={(formValues as any)[visual.channel]}
                onChange={onChange}
              />
            </div>
          );
      }
      return null;
    });
  }
  return null;
};

export const ConfigPanel = observer(({ editorRef }: { editorRef: RefObject<Editor> }) => {
  const editorStore = useEditorStore();
  const [formValues, setFormValues] = useState<CommonMarkVisual>({})

  useEffect(() => {
    const currentElement = editorStore.currentElement
    if (!currentElement) {
      return
    }
    const visuals = currentElement?.visuals

    setFormValues({
      ...visuals,
    })
  }, [editorStore.currentElement])

  return (
    <Card title="Config Panel" style={{ width: '100%', height: '100%' }}>
      {editorStore.currentElement ? generateVisuals(editorStore, editorRef, formValues, setFormValues) : null}
      {/* {currentElement ? generateVisuals(currentElement, editorStore) : null} */}
    </Card>
  );
});
