import { useEffect, useRef } from 'react';
import { ListTable } from '@visactor/vtable';

// eslint-disable-next-line
export const Preview = (props: { data: any[] }) => {
  const containerRef = useRef<HTMLDivElement>();

  useEffect(() => {
    if (!containerRef?.current || props.data.length === 0) {
      return;
    }
    const columns = Object.keys(props.data[0]).map(field => ({
      field: field,
      title: field,
      width: 'auto'
    }));

    const vtable = new ListTable(containerRef.current, {
      records: props.data,
      columns,
      widthMode: 'adaptive'
    });
    return () => vtable.release();
  }, [props.data]);

  return <div id="dataEditorTable" style={{ width: '100%', height: '100%' }} ref={containerRef}></div>;
};
