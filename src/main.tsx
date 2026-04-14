import { StrictMode, useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { dataInit } from './storage/init'

// 初始化数据
function InitWrapper({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    dataInit.init();
  }, []);

  return <>{children}</>;
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <InitWrapper>
      <App />
    </InitWrapper>
  </StrictMode>,
)
