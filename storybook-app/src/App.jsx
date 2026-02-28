import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import CreateStoryPage from './pages/CreateStoryPage';
import EditStoryPage from './pages/EditStoryPage';
import ViewStoryPage from './pages/ViewStoryPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/create" element={<CreateStoryPage />} />
        <Route path="/edit/:id" element={<EditStoryPage />} />
        <Route path="/story/:id" element={<ViewStoryPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
