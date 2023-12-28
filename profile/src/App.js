import './App.css';
import {BrowserRouter as Router,Route,Routes} from 'react-router-dom'
import StickyNavbar from './components/Header';
import Dashboard from './components/Dashboard';
import Footer from './components/Footer';
import Home from './components/Home';

function App() {
  return (
    <>
    
    <Router>
    
    <StickyNavbar />
      
      <Routes>
        <Route path='/' element={<Home />}/>
      </Routes>

    <Footer />

    </Router>
    </>
  );
}

export default App;
