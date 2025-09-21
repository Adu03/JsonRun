/**
 * JSON解析器自定义Hook
 * 提供JSON解析、格式化、压缩等功能
 */

import { useState, useCallback } from 'react';
import { validateJSON, formatJSON, compressJSON, escapeJSON, unescapeJSON } from '../utils/jsonUtils';
import { unicodeToChinese, chineseToUnicode, smartUnicodeConvert } from '../utils/unicodeUtils';
import type { JSONValidationResult, ErrorInfo } from '../types';

/**
 * JSON解析器状态
 */
interface JsonParserState {
  inputText: string;
  outputText: string;
  validationResult: JSONValidationResult;
  error: ErrorInfo | null;
  isProcessing: boolean;
}

/**
 * JSON解析器Hook
 */
export function useJsonParser() {
  const [state, setState] = useState<JsonParserState>({
    inputText: '',
    outputText: '',
    validationResult: { isValid: true },
    error: null,
    isProcessing: false
  });

  /**
   * 更新输入文本
   */
  const setInputText = useCallback((text: string) => {
    setState(prev => ({ ...prev, inputText: text }));
  }, []);

  /**
   * 验证JSON格式
   */
  const validate = useCallback(() => {
    setState(prev => ({ ...prev, isProcessing: true }));
    
    try {
      const result = validateJSON(state.inputText);
      setState(prev => ({
        ...prev,
        validationResult: result,
        error: result.isValid ? null : {
          message: result.error || 'Invalid JSON',
          position: result.position,
          context: state.inputText
        },
        outputText: result.isValid ? state.inputText : '',
        isProcessing: false
      }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: {
          message: error instanceof Error ? error.message : 'Validation failed'
        },
        isProcessing: false
      }));
    }
  }, [state.inputText]);

  /**
   * 格式化JSON
   */
  const format = useCallback((indentSize: number = 2) => {
    setState(prev => ({ ...prev, isProcessing: true }));
    
    try {
      const formatted = formatJSON(state.inputText, indentSize);
      setState(prev => ({
        ...prev,
        outputText: formatted,
        error: null,
        isProcessing: false
      }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: {
          message: error instanceof Error ? error.message : 'Format failed'
        },
        isProcessing: false
      }));
    }
  }, [state.inputText]);

  /**
   * 压缩JSON
   */
  const compress = useCallback(() => {
    setState(prev => ({ ...prev, isProcessing: true }));
    
    try {
      const compressed = compressJSON(state.inputText);
      setState(prev => ({
        ...prev,
        outputText: compressed,
        error: null,
        isProcessing: false
      }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: {
          message: error instanceof Error ? error.message : 'Compress failed'
        },
        isProcessing: false
      }));
    }
  }, [state.inputText]);

  /**
   * 转义JSON
   */
  const escape = useCallback(() => {
    setState(prev => ({ ...prev, isProcessing: true }));
    
    try {
      const escaped = escapeJSON(state.inputText);
      setState(prev => ({
        ...prev,
        outputText: escaped,
        error: null,
        isProcessing: false
      }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: {
          message: error instanceof Error ? error.message : 'Escape failed'
        },
        isProcessing: false
      }));
    }
  }, [state.inputText]);

  /**
   * 去转义JSON
   */
  const unescape = useCallback(() => {
    setState(prev => ({ ...prev, isProcessing: true }));
    
    try {
      const unescaped = unescapeJSON(state.inputText);
      setState(prev => ({
        ...prev,
        outputText: unescaped,
        error: null,
        isProcessing: false
      }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: {
          message: error instanceof Error ? error.message : 'Unescape failed'
        },
        isProcessing: false
      }));
    }
  }, [state.inputText]);

  /**
   * Unicode转中文
   */
  const unicodeToChineseConvert = useCallback(() => {
    setState(prev => ({ ...prev, isProcessing: true }));
    
    try {
      const converted = unicodeToChinese(state.inputText);
      setState(prev => ({
        ...prev,
        outputText: converted,
        error: null,
        isProcessing: false
      }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: {
          message: error instanceof Error ? error.message : 'Unicode conversion failed'
        },
        isProcessing: false
      }));
    }
  }, [state.inputText]);

  /**
   * 中文转Unicode
   */
  const chineseToUnicodeConvert = useCallback(() => {
    setState(prev => ({ ...prev, isProcessing: true }));
    
    try {
      const converted = chineseToUnicode(state.inputText);
      setState(prev => ({
        ...prev,
        outputText: converted,
        error: null,
        isProcessing: false
      }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: {
          message: error instanceof Error ? error.message : 'Chinese to Unicode conversion failed'
        },
        isProcessing: false
      }));
    }
  }, [state.inputText]);

  /**
   * 智能Unicode转换
   */
  const smartUnicodeConvertFunc = useCallback(() => {
    setState(prev => ({ ...prev, isProcessing: true }));
    
    try {
      const converted = smartUnicodeConvert(state.inputText);
      setState(prev => ({
        ...prev,
        outputText: converted || '',
        error: null,
        isProcessing: false
      }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: {
          message: error instanceof Error ? error.message : 'Smart conversion failed'
        },
        isProcessing: false
      }));
    }
  }, [state.inputText]);

  /**
   * 清空输入输出
   */
  const clearAll = useCallback(() => {
    setState(prev => ({
      ...prev,
      inputText: '',
      outputText: '',
      error: null,
      validationResult: { isValid: true }
    }));
  }, []);

  return {
    ...state,
    setInputText,
    setOutputText: (text: string) => setState(prev => ({ ...prev, outputText: text })),
    validate,
    format,
    compress,
    escape,
    unescape,
    unicodeToChinese: unicodeToChineseConvert,
    chineseToUnicode: chineseToUnicodeConvert,
    smartUnicodeConvert: smartUnicodeConvertFunc,
    clearAll
  };
}