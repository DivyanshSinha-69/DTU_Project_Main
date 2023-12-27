import './App.css';
import {BrowserRouter as Router,Route,Routes} from 'react-router-dom'
import Header from './components/Header';
import Dashboard from './components/Dashboard';
function App() {
  return ( 
    <Dashboard/>
  );
}

export default App;
