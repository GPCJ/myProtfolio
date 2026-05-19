import { Routes, Route } from 'react-router-dom';
import Home from './routes/Home';
import ProjectDetail from './routes/ProjectDetail';
import ThemeToggle from '@/components/ui/ThemeToggle';

export default function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/projects/:slug" element={<ProjectDetail />} />
      </Routes>
      <ThemeToggle />
    </>
  );
}
