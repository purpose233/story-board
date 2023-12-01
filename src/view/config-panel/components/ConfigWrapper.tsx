import type { ReactElement, RefObject } from 'react';
import { memo } from 'react';
import { LinkIcon } from './LinkIcon';
import type { Editor } from '../../../editor/editor';

interface Props {
  channel: string;
  editorRef: RefObject<Editor>;
  children: ReactElement;
}

export const ConfigWrapper = memo((props: Props) => {
  const { channel, editorRef, children } = props;

  return (
    <div className="config-panel-entry" key={channel}>
      <span className="config-panel-entry-label">{channel}:</span>
      <div className="config-panel-entry-item">
        {children}
        <LinkIcon editorRef={editorRef} channel={channel} />
      </div>
    </div>
  );
});
