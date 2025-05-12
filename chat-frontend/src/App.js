import React from 'react';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import ChatHome from './ChatHome';

function App() {
  return (
      <Router>
        <Routes>
            <Route path="/ChatHome" element={<ChatHome />} />
        </Routes>
      </Router>
  );
}

export default App;
