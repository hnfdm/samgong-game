import React from 'react';
import SamgongTable from './components/SamgongTable';
import './App.css';

function App() {
  return (
    <div className="App" style={{ backgroundColor: '#FE11C5', minHeight: '100vh' }}>
      <h1 style={{ color: 'white', textAlign: 'center', padding: '20px' }}>
        Samgong Game
      </h1>
      <SamgongTable />
    </div>
  );
}

export default App;