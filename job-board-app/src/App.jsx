import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ResumeUpload from './components/ResumeUpload';
import Results from './components/Results';
import "./App.css"

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<ResumeUpload />} />
        <Route path="/results" element={<Results />} />
      </Routes>
    </Router>
  );
}

export default App;
