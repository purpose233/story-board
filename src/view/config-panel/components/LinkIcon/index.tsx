import React, { useEffect, useMemo, useState, useCallback, type RefObject } from 'react';
import { Dropdown, Popover, Space, Tag } from '@douyinfe/semi-ui';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFont, faHashtag, faLinkSlash, faPaperclip } from '@fortawesome/free-solid-svg-icons';

import './index.less';
import { useEditorStore } from '../../../../store/element';
import type { DataField } from '../../../../typings';
import type { Editor } from '../../../../editor/editor';
import type { GrammarScaleType } from '@visactor/vgrammar';
import { observer } from 'mobx-react';
import type { ScaleViewElement } from '../../../../editor/scales/base';
import { elementVisualConfig } from '../../../../config/visual';
import { isArray } from '@visactor/vutils';

interface Props {
  tip?: string;
  onClick?: () => void;
  editorRef: RefObject<Editor>;
  channel: string;
}

export const LinkIcon = observer((props: Props) => {
  const { editorRef, channel } = props;
  const editorStore = useEditorStore();
  const { currentElement, viewScales, currentDataElement } = editorStore;
  const [menuItems, setMenuItems] = useState<{ label: string; value: string }[]>([]);
  useEffect(() => {
    const menus = [
      {
        label: 'Create New Scale',
        value: 'create'
      }
    ];
    if (viewScales.length > 0) {
      menus.push({
        label: 'Bind Scale',
        value: 'bind'
      });
    }
    setMenuItems(menus);
  }, [viewScales]);

  useEffect(() => {
    // console.log(editorRef?.current);
  }, [editorRef]);

  const bindScale = useCallback(
    (viewScale: ScaleViewElement) => {
      if (!currentElement) {
        return;
      }
      const editor = editorRef.current!;
      const mark = editor?.getElementById(currentElement.id);

      const scale = editor.getScaleById(viewScale.id);

      if (!scale) {
        console.error('scale not exist');
      }

      const data = editor.getDataById(scale!.data.id);

      if (!data) {
        console.error('scale not exist');
      }

      mark?.bindScale(channel, scale!, { field: scale!.field });
      mark?.bindData(data!);

      editorStore.updateElement(editor.getViewElementById(mark!.id)!);
      editorStore.updateViewScales(editor.getViewScales());
      editorStore.setCurrentElement(mark!.id);
      editor.render();
    },
    [channel, currentElement, editorRef, editorStore]
  );

  const createScale = useCallback(
    (field: DataField) => {
      if (!currentElement) {
        return;
      }
      const { type, range, key: domainField } = field;
      const editor = editorRef.current!;
      const mark = editor!.getElementById(currentElement.id)!;

      if (!currentDataElement?.id) {
        console.error('data ');
      }
      const data = editor.getDataById(currentDataElement!.id)!;
      let scaleType: string = '';
      if (type === 'number') {
        scaleType = 'linear';
      } else {
        scaleType = type;
      }
      const scale = editor.createScale({
        type: scaleType as GrammarScaleType,
        data,
        field: domainField
      });

      const visualArr = elementVisualConfig[mark.type];
      const visualConfig = visualArr.find(visual => visual.channel === channel);

      if (visualConfig?.defaultRange) {
        scale.setRange(visualConfig?.defaultRange);
      } else {
        scale.setRange(range);
      }

      const viewScale = editor.getViewScaleById(scale.id)!;

      bindScale(viewScale);
    },
    [bindScale, channel, currentDataElement, currentElement, editorRef]
  );

  const handleDelete = () => {
    if (!currentElement) {
      return;
    }
    const scaleInfo = currentElement?.scaleViewElements[channel];
    const editor = editorRef.current!;
    const mark = editor.getElementById(currentElement.id);
    mark?.removeScale(scaleInfo.id, channel);
    editorStore.updateViewScales(editor.getViewScales());
    editorStore.updateElement(editor.getViewElementById(mark!.id)!);
    editorStore.setCurrentElement(mark!.id);
    editor.render();
  };

  const subCreateDropdown = useMemo(
    () => (
      <Dropdown.Menu>
        {/* @ts-ignore */}
        {currentDataElement?.fields.map(field => (
          <Dropdown.Item
            key={field.key}
            onClick={() => {
              createScale(field);
            }}
          >
            {/* @ts-ignore */}
            <Space>
              {field.type === 'number' ? <FontAwesomeIcon icon={faHashtag} /> : <FontAwesomeIcon icon={faFont} />}
              {field.key}
              <Tag size="small">
                {field.type === 'number' ? `${field.range[0]} - ${field.range[1]}` : `${field.count} values`}
              </Tag>
            </Space>
          </Dropdown.Item>
        ))}
      </Dropdown.Menu>
    ),
    [currentDataElement, createScale]
  );

  const subBindDropdown = useMemo(
    () => (
      <Dropdown.Menu>
        {/* @ts-ignore */}
        {viewScales.map(scale => (
          <Dropdown.Item
            key={scale.id}
            onClick={() => {
              bindScale(scale);
            }}
          >
            {/* @ts-ignore */}
            <Space>
              <Tag size="small">{scale.type}</Tag>
              {scale?.field}
              <Tag size="small">
                {/* FIXME: Incorrect display when scale range is function type */}
                {scale.type === 'linear' ? `${scale.range[0]} - ${scale.range[1]}` : `${scale.range.length} values`}
              </Tag>
            </Space>
          </Dropdown.Item>
        ))}
      </Dropdown.Menu>
    ),
    [bindScale, viewScales]
  );

  const boundScaleInfo = useMemo(() => {
    const scaleView = currentElement?.scaleViewElements[channel];
    if (!scaleView) {
      return;
    }

    const range = isArray(scaleView.range) ? scaleView.range : [];
    const countStr = range ? `[${range?.slice(0, 2).join(',')}..], ${range.length} values` : '';
    const rangeStr = range ? `${range[0]} - ${range[1]}` : '';
    return (
      <Space style={{ padding: '5px' }}>
        <Tag size="small">{scaleView.type}</Tag>
        {scaleView.field}
        <Tag size="small">{scaleView.type === 'linear' ? rangeStr : countStr}</Tag>
      </Space>
    );
  }, [currentElement?.scaleViewElements, channel]);

  return (
    <div className="link-icon-container">
      {currentElement?.scaleViewElements[channel] ? (
        <Popover content={boundScaleInfo} position="left">
          <FontAwesomeIcon className="link-icon-danger" icon={faLinkSlash} onClick={handleDelete} />
        </Popover>
      ) : (
        <Dropdown
          clickToHide={true}
          trigger={'click'}
          position={'leftTop'}
          render={
            <Dropdown.Menu>
              {/* @ts-ignore */}
              {menuItems.map(item => {
                if (item.value === 'create') {
                  return (
                    // Create Scale Menu
                    <Dropdown render={subCreateDropdown} position={'leftTop'}>
                      <Dropdown.Item key={item.label}>{item.label}</Dropdown.Item>
                    </Dropdown>
                  );
                }
                return (
                  // Bind Scale Menu
                  <Dropdown render={subBindDropdown} position={'leftTop'}>
                    <Dropdown.Item key={item.label}>{item.label}</Dropdown.Item>
                  </Dropdown>
                );
              })}
            </Dropdown.Menu>
          }
        >
          <FontAwesomeIcon className="link-icon" icon={faPaperclip} />
        </Dropdown>
      )}
    </div>
  );
});
