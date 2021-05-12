import Login from './Components/Login'
import Signup from './Components/Signup'
import Nav from './Components/Nav'
import MarkDown from './Components/markDown'
import { BrowserRouter as Router , Link, Switch, Route} from 'react-router-dom'
import Upload from './Components/uploadImage'
import { FinalPage } from './Components/finalPage'
import MyBlogs from './Components/MyBlogs'
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
    <Route exact path="/final" component={FinalPage}/>
    <Route exact path="/myblogs" component={MyBlogs}/>
    
      </Switch>
    </div>
    </Router>
  );
}

export default App;
