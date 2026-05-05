/**
 * JSON编辑器组件
 * 基于 CodeMirror 6 的JSON编辑器，优化了体积和加载速度
 */

import React, { useCallback } from 'react';
import { Button } from 'antd';
import CodeMirror from '@uiw/react-codemirror';
import { json } from '@codemirror/lang-json';
import { vscodeDark, vscodeLight } from '@uiw/codemirror-theme-vscode';
import { EditorView } from '@codemirror/view';
import type { EditorTheme } from '../../types';
import './JsonEditor.css';

export interface JsonEditorProps {
  /** 编辑器内容 */
  value: string;
  /** 内容变化回调 */
  onChange?: (value: string) => void;
  /** 编辑器标题 */
  title?: string;
  /** 是否只读 */
  readOnly?: boolean;
  /** 编辑器主题 */
  theme?: EditorTheme;
  /** 语言模式 */
  language?: string;
  /** 高度 */
  height?: string;
  /** 占位符 */
  placeholder?: string;
  /** 是否显示行号 */
  showLineNumbers?: boolean;
  /** 操作按钮 */
  actions?: Array<{
    icon: React.ReactNode;
    text: string;
    onClick: () => void;
    disabled?: boolean;
  }>;
}

const JsonEditor: React.FC<JsonEditorProps> = ({
  value,
  onChange,
  title = 'JSON Editor',
  readOnly = false,
  theme = 'vs',
  language = 'json',
  height = '400px',
  placeholder = 'Enter your JSON here...',
  showLineNumbers = true,
  actions = []
}) => {

  /**
   * 内容变化处理
   */
  const handleChange = useCallback((newValue: string) => {
    if (onChange) {
      onChange(newValue);
    }
  }, [onChange]);

  // 将现有主题映射到 CodeMirror 对应的 VSCode 主题
  const cmTheme = theme === 'vs-dark' || theme === 'hc-black' ? vscodeDark : vscodeLight;

  // CodeMirror 扩展配置
  const extensions = [
    EditorView.lineWrapping, // 自动换行
    EditorView.theme({
      "&": { height: "100%" },
      ".cm-scroller": { overflow: "auto" }
    })
  ];

  if (language === 'json') {
    extensions.push(json());
  }

  return (
    <div className={`json-editor ${readOnly ? 'readonly-mode' : ''}`}>
      <div className="json-editor-header">
        <h3 className="json-editor-title">{title}</h3>
        {readOnly && <span className="read-only-badge">只读</span>}
        {actions.length > 0 && (
          <div className="json-editor-actions">
            {actions.map((action, index) => (
              <Button
                key={index}
                type="text"
                size="small"
                icon={action.icon}
                onClick={action.onClick}
                disabled={action.disabled}
                className="editor-action-btn"
              >
                {action.text}
              </Button>
            ))}
          </div>
        )}
      </div>
      <div className="json-editor-container">
        <CodeMirror
          value={value}
          height={height}
          theme={cmTheme}
          extensions={extensions}
          onChange={handleChange}
          readOnly={readOnly}
          editable={!readOnly}
          basicSetup={{
            lineNumbers: showLineNumbers,
            foldGutter: true,
            highlightActiveLine: !readOnly,
            highlightSelectionMatches: !readOnly,
            autocompletion: !readOnly,
          }}
          placeholder={placeholder}
          className="codemirror-wrapper"
        />
      </div>
    </div>
  );
};

export default JsonEditor;