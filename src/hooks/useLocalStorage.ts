/**
 * 本地存储自定义Hook
 * 提供响应式的本地存储操作
 */

import { useState, useEffect, useCallback } from 'react';

/**
 * 使用本地存储的自定义Hook
 * @param key - 存储键名
 * @param initialValue - 初始值
 * @returns [存储值, 设置值函数]
 */
export function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T | ((val: T) => T)) => void] {
  // 获取初始值
  const readValue = useCallback((): T => {
    if (typeof window === 'undefined') {
      return initialValue;
    }

    try {
      const item = window.localStorage.getItem(key);
      if (item) {
        return JSON.parse(item) as T;
      }
      return initialValue;
    } catch (error) {
      console.warn(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  }, [key, initialValue]);

  // 状态管理
  const [storedValue, setStoredValue] = useState<T>(readValue);

  // 更新本地存储和状态
  const setValue = useCallback((value: T | ((val: T) => T)) => {
    try {
      // 允许值是函数
      const newValue = value instanceof Function ? value(storedValue) : value;
      
      // 保存到状态
      setStoredValue(newValue);
      
      // 保存到本地存储
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, JSON.stringify(newValue));
      }
    } catch (error) {
      console.warn(`Error setting localStorage key "${key}":`, error);
    }
  }, [key, storedValue]);

  // 监听本地存储变化（支持多个标签页同步）
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === key && e.newValue) {
        try {
          setStoredValue(JSON.parse(e.newValue));
        } catch (error) {
          console.warn(`Error parsing localStorage change for key "${key}":`, error);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [key]);

  return [storedValue, setValue];
}

/**
 * 自动保存的自定义Hook
 * @param value - 要保存的值
 * @param key - 存储键名
 * @param delay - 延迟时间（毫秒）
 */
export function useAutoSave<T>(value: T, key: string, delay: number = 1000): void {
  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        if (typeof window !== 'undefined') {
          window.localStorage.setItem(key, JSON.stringify(value));
        }
      } catch (error) {
        console.warn(`Error auto-saving to localStorage key "${key}":`, error);
      }
    }, delay);

    return () => clearTimeout(timer);
  }, [value, key, delay]);
}