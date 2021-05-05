import Login from './Components/Login'
import Signup from './Components/Signup'
import Nav from './Components/Nav'
import MarkDown from './Components/markDown'
import { BrowserRouter as Router , Link, Switch, Route} from 'react-router-dom'
import Upload from './Components/uploadImage'

function App() {
  return (
     <Router>
    <div >
      <Nav/>
      <Switch>
    <Route exact path="/login" component={Login}/>
    <Route exact path="/" component={Signup}/>
    <Route exact path="/mark" component={MarkDown}/>
    <Route exact path="/upload" component={Upload}/>
      
      </Switch>
    </div>
    </Router>
  );
}

export default App;
