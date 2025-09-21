/**
 * 错误信息显示组件
 * 显示JSON解析错误信息
 */

import React from 'react';
import { Alert } from 'antd';
import { CloseCircleOutlined } from '@ant-design/icons';
import type { ErrorInfo } from '../../types';

interface ErrorDisplayProps {
  /** 错误信息 */
  error: ErrorInfo | null;
  /** 是否显示图标 */
  showIcon?: boolean;
  /** 是否可关闭 */
  closable?: boolean;
  /** 关闭回调 */
  onClose?: () => void;
}

const ErrorDisplay: React.FC<ErrorDisplayProps> = ({
  error,
  showIcon = true,
  closable = true,
  onClose
}) => {
  if (!error) {
    return null;
  }

  const { message, position, context } = error;

  /**
   * 获取错误位置信息
   */
  const getPositionInfo = () => {
    if (position === undefined) {
      return '';
    }
    return `位置: ${position}`;
  };

  /**
   * 获取错误上下文
   */
  const getErrorContext = () => {
    if (!context || position === undefined) {
      return null;
    }

    // 获取错误位置附近的文本
    const start = Math.max(0, position - 20);
    const end = Math.min(context.length, position + 20);
    const snippet = context.substring(start, end);
    
    // 标记错误位置
    const relativePosition = position - start;
    const markedSnippet = 
      snippet.substring(0, relativePosition) + 
      '【错误位置】' + 
      snippet.substring(relativePosition);

    return markedSnippet;
  };

  const description = (
    <div className="error-description">
      <div className="error-message">{message}</div>
      {position !== undefined && (
        <div className="error-position">{getPositionInfo()}</div>
      )}
      {getErrorContext() && (
        <div className="error-context">
          <div className="context-label">错误附近内容:</div>
          <pre className="context-text">{getErrorContext()}</pre>
        </div>
      )}
    </div>
  );

  return (
    <div className="error-display">
      <Alert
        message="JSON解析错误"
        description={description}
        type="error"
        icon={showIcon ? <CloseCircleOutlined /> : null}
        closable={closable}
        onClose={onClose}
        className="error-alert"
      />
    </div>
  );
};

export type { ErrorDisplayProps };
export default ErrorDisplay;