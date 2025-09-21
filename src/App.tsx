/**
 * 主应用组件
 * JSON解析工具的主界面
 */

import React, { useEffect, useCallback, useState } from 'react';
import { Layout, message, Button, Space } from 'antd';
import { CopyOutlined, SaveOutlined, FormatPainterOutlined, CompressOutlined, ClearOutlined, ExportOutlined, ImportOutlined, CheckCircleOutlined } from '@ant-design/icons';

// 导入自定义Hook
import { useJsonParser } from './hooks/useJsonParser';
import { useLocalStorage } from './hooks/useLocalStorage';

// 导入组件
import { JsonEditor, ErrorDisplay, ThemeToggle, HistoryPanel } from './components';

// 导入类型
import type { UserSettings } from './types';
import type { HistoryItem } from './utils/storageUtils';

// 导入工具
import { saveToHistory, getHistory } from './utils/storageUtils';

// 导入样式
import './App.css';

const { Header, Content } = Layout;

/**
 * 默认用户设置
 */
const defaultSettings: UserSettings = {
  indentSize: 2,
  autoSave: true,
  theme: 'light',
  editorTheme: 'vs'
};

/**
 * 主应用组件
 */
const App: React.FC = () => {
  // 用户设置
  const [settings, setSettings] = useLocalStorage<UserSettings>('json_parser_settings', defaultSettings);
  
  // 手动保存状态
  const [hasUnsavedChanges, setHasUnsavedChanges] = React.useState(false);
  
  // JSON解析器状态和方法
  const {
    inputText,
    setInputText,
    outputText,
    setOutputText,
    error,
    validate,
    format,
    compress,
    escape,
    unescape,
    unicodeToChinese,
    chineseToUnicode,
    smartUnicodeConvert,
    clearAll
  } = useJsonParser();

  // 历史记录状态
  const [history, setHistory] = useState<HistoryItem[]>([]);

  // 加载历史记录
  useEffect(() => {
    setHistory(getHistory());
  }, []);

  // 组件加载时，从本地存储恢复数据
  useEffect(() => {
    const savedInput = localStorage.getItem('json_parser_input');
    const savedOutput = localStorage.getItem('json_parser_output');
    
    if (savedInput) {
      setInputText(savedInput);
    }
    if (savedOutput) {
      // 输出文本会在解析器状态中处理
    }
  }, [setInputText]);

  // 监听输入变化，标记未保存状态
  useEffect(() => {
    setHasUnsavedChanges(true);
  }, [inputText]);

  // 监听输出变化，标记未保存状态
  useEffect(() => {
    setHasUnsavedChanges(true);
  }, [outputText]);

  // 自动保存输入内容
  useEffect(() => {
    if (settings.autoSave) {
      const timer = setTimeout(() => {
        localStorage.setItem('json_parser_input', inputText);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [inputText, settings.autoSave]);

  // 自动保存输出内容
  useEffect(() => {
    if (settings.autoSave) {
      const timer = setTimeout(() => {
        localStorage.setItem('json_parser_output', outputText);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [outputText, settings.autoSave]);

  /**
   * 复制文本到剪贴板
   */
  const copyToClipboard = useCallback(async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      message.success('已复制到剪贴板');
    } catch (error) {
      message.error('复制失败，请手动复制');
    }
  }, []);

  /**
   * 处理历史记录选择
   */
  const handleHistorySelect = useCallback((item: HistoryItem) => {
    setInputText(item.input);
    setOutputText(item.output);
    setHasUnsavedChanges(true);
    message.success('已加载历史记录');
  }, [setInputText, setOutputText, setHasUnsavedChanges]);

  /**
   * 刷新历史记录列表
   */
  const handleHistoryUpdate = useCallback(() => {
    setHistory(getHistory());
  }, []);

  /**
   * 主题切换处理
   */
  const handleThemeChange = useCallback((newTheme: 'light' | 'dark') => {
    setSettings(prev => ({ 
      ...prev, 
      theme: newTheme,
      editorTheme: newTheme === 'dark' ? 'vs-dark' : 'vs'
    }));
  }, []);

  /**
   * 手动保存数据
   */
  const handleManualSave = useCallback(() => {
    localStorage.setItem('json_parser_input', inputText);
    localStorage.setItem('json_parser_output', outputText);
    // 保存到历史记录
    saveToHistory(inputText, outputText);
    setHistory(getHistory()); // 刷新历史记录列表
    setHasUnsavedChanges(false);
    message.success('保存成功');
  }, [inputText, outputText]);

  /**
   * 格式化JSON（使用当前缩进设置）
   */
  const handleFormat = useCallback(() => {
    format(settings.indentSize);
  }, [format, settings.indentSize]);

  return (
    <Layout className={`app-layout ${settings.theme === 'dark' ? 'dark-theme' : 'light-theme'}`} data-theme={settings.theme}>
      <Header className="app-header">
        <div className="header-content">
          <h1 className="app-title">JSON 解析工具</h1>
          <div className="header-actions">
            <Space size="small" className="json-function-buttons">
              {/* JSON功能按钮组 */}
              <Button
                icon={<CheckCircleOutlined />}
                size="small"
                onClick={validate}
                title="验证JSON格式"
              >
                验证
              </Button>
              <Button
                icon={<FormatPainterOutlined />}
                size="small"
                onClick={handleFormat}
                title="格式化JSON"
              >
                格式化
              </Button>
              <Button
                icon={<CompressOutlined />}
                size="small"
                onClick={compress}
                title="压缩JSON"
              >
                压缩
              </Button>
              <Button
                icon={<ExportOutlined />}
                size="small"
                onClick={escape}
                title="转义特殊字符"
              >
                转义
              </Button>
              <Button
                icon={<ImportOutlined />}
                size="small"
                onClick={unescape}
                title="去除转义"
              >
                去转义
              </Button>
              <Button
                size="small"
                onClick={unicodeToChinese}
                title="Unicode转中文"
              >
                Unicode转中文
              </Button>
              <Button
                size="small"
                onClick={chineseToUnicode}
                title="中文转Unicode"
              >
                中文转Unicode
              </Button>
              <Button
                size="small"
                onClick={smartUnicodeConvert}
                title="智能Unicode转换"
              >
                智能Unicode
              </Button>
              <Button
                icon={<ClearOutlined />}
                size="small"
                danger
                onClick={clearAll}
                title="清空所有内容"
              >
                清空
              </Button>
            </Space>
            <Space size="small">
              <Button
                type="primary"
                icon={<SaveOutlined />}
                onClick={handleManualSave}
                disabled={!hasUnsavedChanges}
                size="small"
              >
                保存
              </Button>
              <div className="theme-toggle-container">
                <ThemeToggle
                  theme={settings.theme}
                  onThemeChange={handleThemeChange}
                />
              </div>
              <span className="version">v1.0.0</span>
            </Space>
          </div>
        </div>
      </Header>
      
      <Content className="app-content">
        <div className="content-wrapper">
          {/* 错误显示 */}
          {error && (
            <ErrorDisplay
              error={error}
              onClose={() => {}}
            />
          )}
          
          {/* 三栏布局：输入(50%) | 输出(35%) | 历史记录(15%) */}
          <div className="main-layout">
            {/* 输入区域 - 50% */}
            <div className="input-section">
              <JsonEditor
                title="输入 JSON"
                value={inputText}
                onChange={setInputText}
                theme={settings.editorTheme}
                height="100%"
                placeholder="在此输入您的 JSON 文本..."
              />
            </div>
            
            {/* 输出区域 - 35% */}
            <div className="output-section">
              <JsonEditor
                title="输出结果"
                value={outputText}
                readOnly={true}
                theme={settings.editorTheme}
                height="100%"
                placeholder="处理结果将在此显示..."
                showLineNumbers={true}
                actions={[
                  {
                    icon: <CopyOutlined />,
                    text: '复制结果',
                    onClick: () => {
                      copyToClipboard(outputText);
                      message.success('输出结果已复制到剪贴板');
                    },
                    disabled: !outputText
                  }
                ]}

              />
            </div>
            
            {/* 历史记录区域 - 15% */}
            <div className="history-section">
              <HistoryPanel
                history={history}
                onHistorySelect={handleHistorySelect}
                onHistoryUpdate={handleHistoryUpdate}
              />
            </div>
          </div>
        </div>
      </Content>
    </Layout>
  );
};

export default App;
