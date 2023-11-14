import React from 'react';
import { Tooltip } from '@douyinfe/semi-ui';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './index.less';
import type { IconProp } from '@fortawesome/fontawesome-svg-core';

interface Props {
  icon: IconProp;
  tip?: string;
  onClick?: () => void;
  active?: boolean;
}

export const Icon = React.memo((props: Props) => {
  const { tip, active = false, ...other } = props;
  const activeClassName = active ? 'active-icon' : '';
  return (
    <div className="icon-container">
      {tip ? (
        <Tooltip content={tip} position="right" showArrow={false}>
          <FontAwesomeIcon className={`side-bar-icon ${activeClassName}`} {...other} />
        </Tooltip>
      ) : (
        <FontAwesomeIcon className={`side-bar-icon ${activeClassName}`} {...other} />
      )}
    </div>
  );
});
