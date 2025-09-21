/**
 * 本地存储工具函数
 * 提供localStorage操作和自动保存功能
 */

// 存储键名常量
const STORAGE_KEYS = {
  JSON_CONTENT: 'json_parser_content',
  INPUT_TEXT: 'json_parser_input',
  OUTPUT_TEXT: 'json_parser_output',
  SETTINGS: 'json_parser_settings',
  HISTORY: 'json_parser_history'
} as const;

/**
 * 存储配置接口
 */
interface Settings {
  indentSize: number;  // 缩进大小
  autoSave: boolean;   // 是否自动保存
  theme: 'light' | 'dark';  // 主题
}

/**
 * 保存JSON内容到本地存储
 * @param content - JSON内容
 */
export const saveJsonContent = (content: string): void => {
  try {
    localStorage.setItem(STORAGE_KEYS.JSON_CONTENT, content);
  } catch (error) {
    console.warn('Failed to save JSON content to localStorage:', error);
  }
};

/**
 * 从本地存储获取JSON内容
 * @returns 保存的JSON内容
 */
export const getJsonContent = (): string | null => {
  try {
    return localStorage.getItem(STORAGE_KEYS.JSON_CONTENT);
  } catch (error) {
    console.warn('Failed to get JSON content from localStorage:', error);
    return null;
  }
};

/**
 * 保存输入文本
 * @param inputText - 输入文本
 */
export const saveInputText = (inputText: string): void => {
  try {
    localStorage.setItem(STORAGE_KEYS.INPUT_TEXT, inputText);
  } catch (error) {
    console.warn('Failed to save input text to localStorage:', error);
  }
};

/**
 * 获取保存的输入文本
 * @returns 保存的输入文本
 */
export const getInputText = (): string | null => {
  try {
    return localStorage.getItem(STORAGE_KEYS.INPUT_TEXT);
  } catch (error) {
    console.warn('Failed to get input text from localStorage:', error);
    return null;
  }
};

/**
 * 保存输出文本
 * @param outputText - 输出文本
 */
export const saveOutputText = (outputText: string): void => {
  try {
    localStorage.setItem(STORAGE_KEYS.OUTPUT_TEXT, outputText);
  } catch (error) {
    console.warn('Failed to save output text to localStorage:', error);
  }
};

/**
 * 获取保存的输出文本
 * @returns 保存的输出文本
 */
export const getOutputText = (): string | null => {
  try {
    return localStorage.getItem(STORAGE_KEYS.OUTPUT_TEXT);
  } catch (error) {
    console.warn('Failed to get output text from localStorage:', error);
    return null;
  }
};

/**
 * 保存用户设置
 * @param settings - 用户设置
 */
export const saveSettings = (settings: Settings): void => {
  try {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  } catch (error) {
    console.warn('Failed to save settings to localStorage:', error);
  }
};

/**
 * 获取用户设置
 * @returns 用户设置
 */
export const getSettings = (): Settings | null => {
  try {
    const settingsStr = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    return settingsStr ? JSON.parse(settingsStr) : null;
  } catch (error) {
    console.warn('Failed to get settings from localStorage:', error);
    return null;
  }
};

/**
 * 获取默认设置
 * @returns 默认设置
 */
export const getDefaultSettings = (): Settings => ({
  indentSize: 2,
  autoSave: true,
  theme: 'light'
});

/**
 * 清除所有本地存储的数据
 */
export const clearAllStorage = (): void => {
  try {
    Object.values(STORAGE_KEYS).forEach(key => {
      localStorage.removeItem(key);
    });
  } catch (error) {
    console.warn('Failed to clear localStorage:', error);
  }
};

/**
 * 自动保存管理器
 */
export class AutoSaveManager {
  private timer: ReturnType<typeof setTimeout> | null = null;
  private delay: number;

  constructor(delay: number = 1000) {
    this.delay = delay;
  }

  /**
   * 触发自动保存
   * @param saveFunction - 保存函数
   */
  public triggerAutoSave(saveFunction: () => void): void {
    // 清除之前的定时器
    if (this.timer) {
      clearTimeout(this.timer);
    }

    // 设置新的定时器
    this.timer = setTimeout(() => {
      saveFunction();
      this.timer = null;
    }, this.delay);
  }

  /**
   * 销毁自动保存管理器
   */
  public destroy(): void {
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }
  }
}

/**
 * 历史记录项接口
 */
export interface HistoryItem {
  id: string;
  name: string;
  input: string;
  output: string;
  timestamp: number;
  createdAt: string; // YY-MM-DD HH:mm 格式
}

/**
 * 获取格式化时间
 * @param date - 日期对象
 * @returns YY-MM-DD HH:mm 格式的时间字符串
 */
export const formatDateTime = (date: Date): string => {
  const year = date.getFullYear().toString().slice(-2);
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  return `${year}-${month}-${day} ${hours}:${minutes}`;
};

/**
 * 保存历史记录
 * @param input - 输入内容
 * @param output - 输出内容
 * @param name - 记录名称（可选，默认使用时间戳）
 */
export const saveToHistory = (input: string, output: string, name?: string): void => {
  try {
    const existingHistory = getHistory();
    const now = new Date();
    const timestamp = now.getTime();
    const createdAt = formatDateTime(now);
    
    const newItem: HistoryItem = {
      id: `history_${timestamp}`,
      name: name || createdAt,
      input,
      output,
      timestamp,
      createdAt
    };

    // 添加到开头，限制15条记录
    const updatedHistory = [newItem, ...existingHistory].slice(0, 15);
    localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(updatedHistory));
  } catch (error) {
    console.warn('Failed to save history to localStorage:', error);
  }
};

/**
 * 获取历史记录
 * @returns 历史记录数组
 */
export const getHistory = (): HistoryItem[] => {
  try {
    const historyStr = localStorage.getItem(STORAGE_KEYS.HISTORY);
    return historyStr ? JSON.parse(historyStr) : [];
  } catch (error) {
    console.warn('Failed to get history from localStorage:', error);
    return [];
  }
};

/**
 * 更新历史记录名称
 * @param id - 记录ID
 * @param newName - 新名称
 */
export const updateHistoryName = (id: string, newName: string): void => {
  try {
    const history = getHistory();
    const updatedHistory = history.map(item => 
      item.id === id ? { ...item, name: newName } : item
    );
    localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(updatedHistory));
  } catch (error) {
    console.warn('Failed to update history name:', error);
  }
};

/**
 * 删除历史记录
 * @param id - 记录ID
 */
export const deleteHistoryItem = (id: string): void => {
  try {
    const history = getHistory();
    const updatedHistory = history.filter(item => item.id !== id);
    localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(updatedHistory));
  } catch (error) {
    console.warn('Failed to delete history item:', error);
  }
};

/**
 * 清空所有历史记录
 */
export const clearAllHistory = (): void => {
  try {
    localStorage.removeItem(STORAGE_KEYS.HISTORY);
  } catch (error) {
    console.warn('Failed to clear history:', error);
  }
};