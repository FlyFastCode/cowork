import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { MainLayout } from './components/layout/MainLayout';
import { DashboardPage } from './components/layout/DashboardPage';
import { TaskPublishPage } from './components/task/TaskPublishPage';
import { TaskPlazaPage } from './components/plaza/TaskPlazaPage';
import { UserPlazaPage } from './components/plaza/UserPlazaPage';
import { MarketplacePage } from './components/marketplace/MarketplacePage';
import { AchievementPage } from './components/achievement/AchievementPage';
import { TaskMatchingPage } from './components/matching/TaskMatchingPage';

function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<MainLayout />}>
            <Route index element={<DashboardPage />} />
            <Route path="task-publish" element={<TaskPublishPage />} />
            <Route path="task-plaza" element={<TaskPlazaPage />} />
            <Route path="task-matching" element={<TaskMatchingPage />} />
            <Route path="user-plaza" element={<UserPlazaPage />} />
            <Route path="marketplace" element={<MarketplacePage />} />
            <Route path="achievement" element={<AchievementPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AppProvider>
  );
}

export default App;
