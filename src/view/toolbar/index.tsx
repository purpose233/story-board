import { Icon } from './components/Icon';
import { faCircle, faSquare, faObjectUngroup, faHand } from '@fortawesome/free-regular-svg-icons';
import {
  faChartArea,
  faChartLine,
  faChartPie,
  faDiamond,
  faDrawPolygon,
  faFont
} from '@fortawesome/free-solid-svg-icons';
import { observer } from 'mobx-react';
import { useEditorStore } from '../../store/element';
import { type RefObject } from 'react';
import type { Editor } from '../../editor/editor';
import { MarkType } from '../../typings/mark';
import { CommonOperateType } from '../../typings/editor';

import './index.less';

interface Props {
  editorRef: RefObject<Editor>;
}

export const Toolbar = observer(({ editorRef }: Props) => {
  const editorStore = useEditorStore();
  const { currentOperationType } = editorStore;

  return (
    <div className="toolbar-container">
      <Icon
        active={currentOperationType === CommonOperateType.pointer}
        icon={faHand}
        tip="pointer"
        onClick={() => editorStore.updateCurrentOperationType(CommonOperateType.pointer)}
      />
      <Icon
        active={currentOperationType === MarkType.circle}
        icon={faCircle}
        tip="arc"
        onClick={() => editorStore.updateCurrentOperationType(MarkType.circle)}
      />
      <Icon
        active={currentOperationType === MarkType.rect}
        icon={faSquare}
        tip="rect"
        onClick={() => editorStore.updateCurrentOperationType(MarkType.rect)}
      />
      <Icon
        active={currentOperationType === MarkType.group}
        icon={faObjectUngroup}
        tip="group"
        onClick={() => editorStore.updateCurrentOperationType(MarkType.group)}
      />
      <Icon
        active={currentOperationType === MarkType.text}
        icon={faFont}
        tip="text"
        onClick={() => editorStore.updateCurrentOperationType(MarkType.text)}
      />
      <Icon
        active={currentOperationType === MarkType.arc}
        icon={faChartPie}
        tip="arc"
        onClick={() => editorStore.updateCurrentOperationType(MarkType.arc)}
      />
      <Icon
        active={currentOperationType === MarkType.symbol}
        icon={faDiamond}
        tip="symbol"
        onClick={() => editorStore.updateCurrentOperationType(MarkType.symbol)}
      />
      <Icon
        active={currentOperationType === MarkType.polygon}
        icon={faDrawPolygon}
        tip="polygon"
        onClick={() => editorStore.updateCurrentOperationType(MarkType.polygon)}
      />
      <Icon
        active={currentOperationType === MarkType.area}
        icon={faChartArea}
        tip="area"
        onClick={() => editorStore.updateCurrentOperationType(MarkType.area)}
      />
      <Icon
        active={currentOperationType === MarkType.line}
        icon={faChartLine}
        tip="line"
        onClick={() => editorStore.updateCurrentOperationType(MarkType.line)}
      />
    </div>
  );
});
