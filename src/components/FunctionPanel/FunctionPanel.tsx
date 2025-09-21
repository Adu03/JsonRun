/**
 * 功能按钮面板组件
 * 提供JSON处理的各种功能按钮
 */

import React from 'react';
import { Button, Space, Tooltip, Select } from 'antd';
import {
  CheckCircleOutlined,
  FormatPainterOutlined,
  CompressOutlined,
  ExportOutlined,
  ImportOutlined,
  SyncOutlined,
  ClearOutlined,
  CopyOutlined
} from '@ant-design/icons';

export interface FunctionPanelProps {
  /** 缩进大小 */
  indentSize: number;
  /** 缩进大小变化回调 */
  onIndentSizeChange?: (size: number) => void;
  /** 验证按钮点击 */
  onValidate?: () => void;
  /** 格式化按钮点击 */
  onFormat?: () => void;
  /** 压缩按钮点击 */
  onCompress?: () => void;
  /** 转义按钮点击 */
  onEscape?: () => void;
  /** 去转义按钮点击 */
  onUnescape?: () => void;
  /** Unicode转中文按钮点击 */
  onUnicodeToChinese?: () => void;
  /** 中文转Unicode按钮点击 */
  onChineseToUnicode?: () => void;
  /** 智能Unicode转换按钮点击 */
  onSmartUnicode?: () => void;
  /** 清空按钮点击 */
  onClear?: () => void;
  /** 复制输出按钮点击 */
  onCopyOutput?: () => void;
  /** 是否正在处理 */
  loading?: boolean;
}

const FunctionPanel: React.FC<FunctionPanelProps> = ({
  indentSize,
  onIndentSizeChange,
  onValidate,
  onFormat,
  onCompress,
  onEscape,
  onUnescape,
  onUnicodeToChinese,
  onChineseToUnicode,
  onSmartUnicode,
  onClear,
  onCopyOutput,
  loading = false
}) => {
  const indentOptions = [
    { value: 2, label: '2 spaces' },
    { value: 4, label: '4 spaces' }
  ];

  return (
    <div className="function-panel">
      <div className="function-panel-section">
        <h4 className="section-title">基本操作</h4>
        <Space wrap>
          <Tooltip title="验证JSON格式是否正确">
            <Button
              type="primary"
              icon={<CheckCircleOutlined />}
              onClick={onValidate}
              loading={loading}
            >
              验证
            </Button>
          </Tooltip>
          
          <Tooltip title="格式化JSON，使其更易读">
            <Button
              icon={<FormatPainterOutlined />}
              onClick={onFormat}
              loading={loading}
            >
              格式化
            </Button>
          </Tooltip>
          
          <Tooltip title="压缩JSON，移除多余空格和换行">
            <Button
              icon={<CompressOutlined />}
              onClick={onCompress}
              loading={loading}
            >
              压缩
            </Button>
          </Tooltip>
        </Space>
      </div>

      <div className="function-panel-section">
        <h4 className="section-title">字符串处理</h4>
        <Space wrap>
          <Tooltip title="转义JSON字符串中的特殊字符">
            <Button
              icon={<ExportOutlined />}
              onClick={onEscape}
              loading={loading}
            >
              转义
            </Button>
          </Tooltip>
          
          <Tooltip title="去转义JSON字符串">
            <Button
              icon={<ImportOutlined />}
              onClick={onUnescape}
              loading={loading}
            >
              去转义
            </Button>
          </Tooltip>
        </Space>
      </div>

      <div className="function-panel-section">
        <h4 className="section-title">Unicode转换</h4>
        <Space wrap>
          <Tooltip title="将Unicode编码转换为中文字符">
            <Button
              onClick={onUnicodeToChinese}
              loading={loading}
            >
              Unicode转中文
            </Button>
          </Tooltip>
          
          <Tooltip title="将中文字符转换为Unicode编码">
            <Button
              onClick={onChineseToUnicode}
              loading={loading}
            >
              中文转Unicode
            </Button>
          </Tooltip>
          
          <Tooltip title="根据输入内容自动选择转换方向">
            <Button
              icon={<SyncOutlined />}
              onClick={onSmartUnicode}
              loading={loading}
            >
              智能转换
            </Button>
          </Tooltip>
        </Space>
      </div>

      <div className="function-panel-section">
        <h4 className="section-title">设置</h4>
        <Space wrap>
          <div className="indent-selector">
            <span className="selector-label">缩进：</span>
            <Select
              value={indentSize}
              onChange={onIndentSizeChange}
              options={indentOptions}
              style={{ width: 100 }}
            />
          </div>
        </Space>
      </div>

      <div className="function-panel-section">
        <h4 className="section-title">其他</h4>
        <Space wrap>
          <Tooltip title="复制输出内容到剪贴板">
            <Button
              icon={<CopyOutlined />}
              onClick={onCopyOutput}
            >
              复制输出
            </Button>
          </Tooltip>
          
          <Tooltip title="清空输入和输出内容">
            <Button
              danger
              icon={<ClearOutlined />}
              onClick={onClear}
            >
              清空
            </Button>
          </Tooltip>
        </Space>
      </div>
    </div>
  );
};

export default FunctionPanel;