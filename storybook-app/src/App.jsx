import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './hooks/useAuth';
import AuthGuard from './components/auth/AuthGuard';
import HomePage from './pages/HomePage';
import CreateStoryPage from './pages/CreateStoryPage';
import EditStoryPage from './pages/EditStoryPage';
import ViewStoryPage from './pages/ViewStoryPage';
import LoginPage from './pages/LoginPage';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/" element={
            <AuthGuard>
              <HomePage />
            </AuthGuard>
          } />
          <Route path="/create" element={
            <AuthGuard>
              <CreateStoryPage />
            </AuthGuard>
          } />
          <Route path="/edit/:id" element={
            <AuthGuard>
              <EditStoryPage />
            </AuthGuard>
          } />
          <Route path="/story/:id" element={<ViewStoryPage />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
