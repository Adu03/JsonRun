/**
 * 项目通用类型定义
 */

/**
 * JSON验证结果
 */
export interface JSONValidationResult {
  isValid: boolean;
  error?: string;
  position?: number;
}

/**
 * 编辑器主题
 */
export type EditorTheme = 'vs' | 'vs-dark' | 'hc-black';

/**
 * 功能按钮类型
 */
export interface FunctionButton {
  key: string;
  label: string;
  icon?: string;
  description: string;
}

/**
 * 用户设置
 */
export interface UserSettings {
  indentSize: number;      // 缩进大小
  autoSave: boolean;       // 是否自动保存
  theme: 'light' | 'dark'; // 主题
  editorTheme: EditorTheme; // 编辑器主题
}

/**
 * 错误信息
 */
export interface ErrorInfo {
  message: string;
  position?: number;
  context?: string;
}

/**
 * 编辑器配置
 */
export interface EditorConfig {
  language: string;
  theme: EditorTheme;
  fontSize: number;
  wordWrap: 'on' | 'off';
  minimap: {
    enabled: boolean;
  };
}