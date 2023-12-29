import './App.css';
import {BrowserRouter as Router,Route,Routes} from 'react-router-dom'
import StickyNavbar from './components/Header';
import Footer from './components/Footer';
import Home from './components/Home';
import Login from './components/Login';
import Teacher from './components/Teacher';

function App() {
  return (
    <>
    
    <Router>
    
    <StickyNavbar />
      
      <Routes>
        <Route path='/' element={<Home />}/>
        <Route path='/login' element={<Login />}/>
        <Route path='/teacher' element={<Teacher />}/>
      </Routes>

    <Footer />

    </Router>
    </>
  );
}

export default App;
