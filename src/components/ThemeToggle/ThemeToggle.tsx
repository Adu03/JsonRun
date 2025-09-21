/**
 * 主题切换开关组件
 * 左右滑动开关方式切换明暗主题
 */

import React from 'react';
import { SunOutlined, MoonOutlined } from '@ant-design/icons';
import './ThemeToggle.css';

export interface ThemeToggleProps {
  /** 当前主题 */
  theme: 'light' | 'dark';
  /** 主题切换回调 */
  onThemeChange?: (theme: 'light' | 'dark') => void;
}

const ThemeToggle: React.FC<ThemeToggleProps> = ({
  theme,
  onThemeChange
}) => {
  /**
   * 处理主题切换
   */
  const handleToggle = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    onThemeChange?.(newTheme);
  };

  return (
    <div className="theme-toggle">
      <div 
        className={`theme-toggle-switch ${theme === 'dark' ? 'dark' : 'light'}`}
        onClick={handleToggle}
      >
        <div className="theme-toggle-slider">
          <div className="theme-toggle-icon">
            {theme === 'light' ? <SunOutlined /> : <MoonOutlined />}
          </div>
        </div>
      </div>
      <span className="theme-toggle-label">
        {theme === 'light' ? '浅色' : '深色'}
      </span>
    </div>
  );
};

export default ThemeToggle;