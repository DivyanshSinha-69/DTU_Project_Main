import './App.css';
import CandidateInfo from './Components/CandidateProfile/CandidateInfo';
import Leftbar from './Components/CandidateProfile/Leftbar';
import Topbar from './Components/Topbar/Topbar';
function App() {
  return (
    <div>
      <Topbar/>
      <Leftbar/>
      <CandidateInfo/>
    </div>
  );
}

export default App;
