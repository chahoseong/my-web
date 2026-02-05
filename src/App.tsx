import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import TeamPage from './pages/TeamPage';
import WeatherPage from './pages/WeatherPage';
import { WeatherProvider } from './contexts/WeatherContext';

function App() {
  return (
    <WeatherProvider>
      <BrowserRouter>
        <Routes>
          {/* "/" 경로에 Layout을 먼저 배치하고, 그 안의 Outlet 자리에 자식들을 넣습니다. */}
          <Route path="/" element={<Layout />}>
            <Route index element={<HomePage />} /> {/* 기본 화면 */}
            <Route path="team" element={<TeamPage />} /> {/* "/team" 경로 */}
            <Route path="weather" element={<WeatherPage />} /> { /* "/weather" 경로 */ }
          </Route>
        </Routes>
      </BrowserRouter>
    </WeatherProvider>
  );
}

export default App

