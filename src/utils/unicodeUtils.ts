/**
 * Unicode转换工具函数
 * 提供Unicode编码与中文互转功能
 */

/**
 * Unicode转中文
 * @param text - 包含Unicode编码的文本（如：\u4e2d\u6587）
 * @returns 转换后的中文字符
 */
export const unicodeToChinese = (text: string): string => {
  try {
    // 使用JSON.parse来安全地解析Unicode转义序列
    // 这样可以正确处理包含引号和换行符的字符串
    return JSON.parse('"' + text.replace(/"/g, '\\"') + '"');
  } catch (error) {
    // 如果JSON.parse失败，尝试使用replace方法
    try {
      return text.replace(/\\u([0-9a-fA-F]{4})/g, (_, hex) => {
        return String.fromCharCode(parseInt(hex, 16));
      });
    } catch (fallbackError) {
      throw new Error('Unicode conversion failed');
    }
  }
};

/**
 * 中文转Unicode
 * @param text - 中文字符串
 * @returns Unicode编码字符串（如：\u4e2d\u6587）
 */
export const chineseToUnicode = (text: string): string => {
  try {
    return text
      .split('')
      .map(char => {
        const code = char.charCodeAt(0);
        // 只对非ASCII字符进行Unicode编码
        if (code > 127) {
          return '\\u' + code.toString(16).padStart(4, '0');
        }
        return char;
      })
      .join('');
  } catch (error) {
    throw new Error('Chinese to Unicode conversion failed');
  }
};

/**
 * 判断文本是否包含Unicode编码
 * @param text - 要检查的文本
 * @returns 是否包含Unicode编码
 */
export const containsUnicode = (text: string): boolean => {
  return /\\u[0-9a-fA-F]{4}/.test(text);
};

/**
 * 智能转换（根据输入内容自动选择转换方向）
 * @param text - 输入文本
 * @returns 转换后的文本
 */
export const smartUnicodeConvert = (text: string): string => {
  try {
    // 如果包含Unicode编码，则转换为中文
    if (containsUnicode(text)) {
      return unicodeToChinese(text);
    } else {
      // 否则将中文转换为Unicode
      return chineseToUnicode(text);
    }
  } catch (error) {
    throw new Error('Smart conversion failed');
  }
};