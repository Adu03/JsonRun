/**
 * JSON工具函数
 * 提供JSON解析、格式化、压缩、转义等功能
 */

/**
 * 验证JSON格式是否正确
 * @param jsonString - 要验证的JSON字符串
 * @returns 验证结果对象
 */
export const validateJSON = (jsonString: string): { isValid: boolean; error?: string; position?: number } => {
  try {
    JSON.parse(jsonString);
    return { isValid: true };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    
    // 提取错误位置信息
    const positionMatch = errorMessage.match(/position (\d+)/);
    const position = positionMatch ? parseInt(positionMatch[1]) : undefined;
    
    return { 
      isValid: false, 
      error: errorMessage, 
      position 
    };
  }
};

/**
 * 格式化JSON字符串
 * @param jsonString - 要格式化的JSON字符串
 * @param indent - 缩进空格数（默认为2）
 * @returns 格式化后的JSON字符串
 */
export const formatJSON = (jsonString: string, indent: number = 2): string => {
  try {
    const parsed = JSON.parse(jsonString);
    return JSON.stringify(parsed, null, indent);
  } catch (error) {
    throw new Error('Invalid JSON format');
  }
};

/**
 * 压缩JSON字符串（移除多余空格和换行）
 * @param jsonString - 要压缩的JSON字符串
 * @returns 压缩后的JSON字符串
 */
export const compressJSON = (jsonString: string): string => {
  try {
    const parsed = JSON.parse(jsonString);
    return JSON.stringify(parsed);
  } catch (error) {
    throw new Error('Invalid JSON format');
  }
};

/**
 * 转义JSON字符串中的特殊字符
 * @param jsonString - 要转义的JSON字符串
 * @returns 转义后的字符串
 */
export const escapeJSON = (jsonString: string): string => {
  try {
    // 首先确保是有效的JSON
    JSON.parse(jsonString);
    
    // 转义特殊字符
    return jsonString
      .replace(/\\/g, '\\\\')  // 转义反斜杠
      .replace(/"/g, '\\"')     // 转义双引号
      .replace(/\n/g, '\\n')    // 转义换行
      .replace(/\r/g, '\\r')    // 转义回车
      .replace(/\t/g, '\\t');   // 转义制表符
  } catch (error) {
    throw new Error('Invalid JSON format');
  }
};

/**
 * 去转义JSON字符串中的特殊字符
 * @param jsonString - 要去转义的字符串
 * @returns 去转义后的JSON字符串
 */
export const unescapeJSON = (jsonString: string): string => {
  try {
    // 去转义特殊字符
    const unescaped = jsonString
      .replace(/\\\\/g, '\\')   // 去转义反斜杠
      .replace(/\\"/g, '"')      // 去转义双引号
      .replace(/\\n/g, '\n')     // 去转义换行
      .replace(/\\r/g, '\r')     // 去转义回车
      .replace(/\\t/g, '\t');    // 去转义制表符
    
    // 验证去转义后的字符串是否为有效JSON
    JSON.parse(unescaped);
    return unescaped;
  } catch (error) {
    throw new Error('Invalid escaped JSON format');
  }
};

/**
 * 获取JSON错误位置附近的文本片段
 * @param jsonString - JSON字符串
 * @param position - 错误位置
 * @param context - 上下文字符数（默认为20）
 * @returns 错误位置附近的文本片段
 */
export const getErrorContext = (jsonString: string, position: number, context: number = 20): string => {
  const start = Math.max(0, position - context);
  const end = Math.min(jsonString.length, position + context);
  return jsonString.substring(start, end);
};

export interface JsonStats {
  depth: number;
  itemCount: number;
  typeLabel: string;
}

/**
 * 计算JSON的层级和节点数量
 * @param jsonString - 要计算的JSON字符串
 * @returns 包含层级和节点数量的对象，如果解析失败返回null
 */
export const getJsonStats = (jsonString: string): JsonStats | null => {
  try {
    if (!jsonString || jsonString.trim() === '') return null;
    const parsed = JSON.parse(jsonString);
    
    let itemCount = 0;
    let typeLabel = '节点';
    
    // 直观统计：根元素的子项数量
    if (Array.isArray(parsed)) {
      itemCount = parsed.length;
      typeLabel = '元素';
    } else if (parsed !== null && typeof parsed === 'object') {
      itemCount = Object.keys(parsed).length;
      typeLabel = '键值对';
    } else {
      itemCount = 1;
      typeLabel = '值';
    }
    
    // 直观层级：只有对象和数组算作嵌套层级，基本数据类型不增加层级
    const getDepth = (obj: any): number => {
      if (obj === null || typeof obj !== 'object') {
        return 0; // 基本数据类型不增加额外深度
      }
      
      let maxChildDepth = 0;
      if (Array.isArray(obj)) {
        for (const item of obj) {
          maxChildDepth = Math.max(maxChildDepth, getDepth(item));
        }
      } else {
        for (const key in obj) {
          if (Object.prototype.hasOwnProperty.call(obj, key)) {
            maxChildDepth = Math.max(maxChildDepth, getDepth(obj[key]));
          }
        }
      }
      return 1 + maxChildDepth;
    };
    
    const depth = Math.max(1, getDepth(parsed));
    return { depth, itemCount, typeLabel };
  } catch (e) {
    return null;
  }
};
