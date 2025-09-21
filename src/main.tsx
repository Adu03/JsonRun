import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

// 修复 ResizeObserver 错误
const debounce = (fn: Function, delay: number) => {
  let timer: ReturnType<typeof setTimeout>;
  return (...args: any[]) => {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
};

const originalResizeObserver = window.ResizeObserver;
window.ResizeObserver = class ResizeObserver extends originalResizeObserver {
  constructor(callback: Function) {
    super(debounce(callback, 16));
  }
};

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
