import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import ChatPage from './pages/ChatPage';
import NotFoundPage from './pages/NotFoundPage';

const App = () => (
  <BrowserRouter>
    <Routes>
      {/* Redirect root to /chat */}
      <Route path="/" element={<Navigate to="/chat" replace />} />
      <Route path="/chat" element={<ChatPage />} />
      {/* 404 catch-all */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  </BrowserRouter>
);

export default App;
