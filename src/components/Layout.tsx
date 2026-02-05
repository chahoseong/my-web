import { Outlet, useLocation } from 'react-router-dom';
import NavBar from './NavBar';
import WeatherWidget from './WeatherWidget';

export default function Layout() {
  const location = useLocation();
  const isWeatherPage = location.pathname === '/weather';

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 selection:bg-blue-100 selection:text-blue-700">
      {/* Header with Glassmorphism */}
      <header className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b border-slate-200/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center shadow-lg shadow-blue-200">
              <span className="text-white font-bold text-xl">C</span>
            </div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
              Clap Campus
            </h1>
          </div>
          <NavBar />
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-grow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200/60 min-h-[calc(100vh-12rem)] overflow-hidden">
            <Outlet />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-8">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-slate-500 text-sm">
            © 2026 Clap Campus. Built with React & Tailwind CSS v4.
          </p>
        </div>
      </footer>

      {/* Global Floating Weather Widget - Hidden on Weather Page */}
      {!isWeatherPage && <WeatherWidget isFloating={true} />}
    </div>
  );
}


