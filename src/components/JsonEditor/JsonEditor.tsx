/**
 * JSON编辑器组件
 * 基于Monaco Editor的JSON编辑器
 */

import React, { useRef, useCallback } from 'react';
import { Button } from 'antd';
import Editor from '@monaco-editor/react';
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
  const editorRef = useRef<any>(null);

  /**
   * 编辑器加载完成回调
   */
  const handleEditorDidMount = useCallback((editor: any, monaco: any) => {
    editorRef.current = editor;
    
    // 设置编辑器选项 - 优化滚动条显示
    editor.updateOptions({
      fontSize: 14,
      wordWrap: 'on',
      minimap: { 
        enabled: window.innerWidth > 768,
        autohide: true // 自动隐藏小地图
      },
      scrollBeyondLastLine: false,
      automaticLayout: true,
      tabSize: 2,
      insertSpaces: true,
      formatOnPaste: !readOnly, // 只读模式下禁用粘贴格式化
      formatOnType: !readOnly, // 只读模式下禁用输入格式化
      scrollbar: {
        vertical: 'auto', // 根据需要显示垂直滚动条
        horizontal: 'auto', // 根据需要显示水平滚动条
        verticalScrollbarSize: 6,
        horizontalScrollbarSize: 6
      },
      // 只读模式下的特殊配置
      domReadOnly: readOnly,
      renderLineHighlight: readOnly ? 'none' : 'line', // 只读模式下不显示行高亮
      hideCursorInOverviewRuler: readOnly, // 只读模式下隐藏光标在概览标尺中
      matchBrackets: readOnly ? 'never' : 'always', // 只读模式下禁用括号匹配
      occurrencesHighlight: readOnly ? 'off' : 'singleFile', // 只读模式下禁用选中高亮
      selectionHighlight: !readOnly, // 只读模式下禁用选择高亮
      folding: true, // 启用代码折叠
      foldingStrategy: 'auto', // 自动折叠策略
      showFoldingControls: 'always', // 始终显示折叠控件
      unfoldOnClickAfterEndOfLine: false // 点击行尾不展开
    });

    // 如果是JSON模式，启用JSON验证
    if (language === 'json') {
      // Monaco Editor内置JSON验证
      const model = editor.getModel();
      if (model) {
        monaco.editor.setModelLanguage(model, 'json');
      }
    }
  }, [language, readOnly]);

  /**
   * 内容变化处理
   */
  const handleChange = useCallback((newValue: string | undefined) => {
    if (onChange && newValue !== undefined) {
      onChange(newValue);
    }
  }, [onChange]);

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
        <Editor
          height={height}
                language={language}
                theme={theme}
                value={value}
                onChange={handleChange}
                onMount={handleEditorDidMount}
                loading={<div className="editor-loading">加载编辑器中...</div>}
                options={{
                  readOnly,
                  lineNumbers: showLineNumbers ? 'on' : 'off',
                  roundedSelection: false,
                  scrollBeyondLastLine: false,
                  automaticLayout: true,
                  wordWrap: 'on',
                  fontSize: 14,
                  minimap: {
                    enabled: window.innerWidth > 768
                  },
                  // 只读模式下的额外配置
                  domReadOnly: readOnly,
                  renderLineHighlight: readOnly ? 'none' : 'line',
                  hideCursorInOverviewRuler: readOnly,
                  matchBrackets: readOnly ? 'never' : 'always',
                  occurrencesHighlight: readOnly ? 'off' : 'singleFile',
                  selectionHighlight: !readOnly
                }}
        />
        {value === '' && !readOnly && (
          <div className="editor-placeholder">
            {placeholder}
          </div>
        )}
      </div>
    </div>
  );
};

export default JsonEditor;