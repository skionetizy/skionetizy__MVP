import Login from './Components/Login'
import Signup from './Components/Signup'
import Nav from './Components/Nav'
import { BrowserRouter as Router , Link, Switch, Route} from 'react-router-dom'

function App() {
  return (
     <Router>
    <div >
      <Nav/>
      <Switch>
    <Route exact path="/login" component={Login}/>
    <Route exact path="/" component={Signup}/>
      
      </Switch>
    </div>
    </Router>
  );
}

export default App;
