import '@/App.scss';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ManagingPage from './pages/ManagingPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<ManagingPage />} />
        <Route path="/managing" element={<ManagingPage />} />
      </Routes>
    </Router>
  );
}

export default App;
