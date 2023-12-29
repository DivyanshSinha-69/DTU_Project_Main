import './App.css';
import {BrowserRouter as Router,Route,Routes} from 'react-router-dom'
import StickyNavbar from './components/Header';
import Dashboard from './components/Dashboard';
import Footer from './components/Footer';
import Home from './components/Home';
import Login from './components/Login';

function App() {
  return (
    <>
    
    <Router>
    
    <StickyNavbar />
      
      <Routes>
        <Route path='/' element={<Home />}/>
        <Route path='/login' element={<Login />}/>
      </Routes>

    <Footer />

    </Router>
    </>
  );
}

export default App;
