import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import ProjectSubmit from './pages/ProjectSubmit';
import ProjectDetail from './pages/ProjectDetail';
import VerifierQueue from './pages/VerifierQueue';
import Marketplace from './pages/Marketplace';
import Transparency from './pages/Transparency';
import Login from './pages/Login';
import Register from './pages/Register';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/submit" element={<ProjectSubmit />} />
          <Route path="/project/:id" element={<ProjectDetail />} />
          <Route path="/verifier-queue" element={<VerifierQueue />} />
          <Route path="/marketplace" element={<Marketplace />} />
          <Route path="/transparency" element={<Transparency />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
