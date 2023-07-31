import {Route, Switch} from 'react-router-dom'
import {useState, useEffect} from 'react'
import {useDispatch} from 'react-redux'
import * as sessionActions from './store/session'
import Navigation from './components/Navigation'
import SpotsIndex from './components/Spots/index'
import SpotsDetail from './components/Spots/SpotsDetail'

function App() {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);
  useEffect(()=> {
    dispatch(sessionActions.restoreUser())
    .then(()=> setIsLoaded(true))
  },[dispatch])

  return (
    <>
    <Navigation isLoaded={isLoaded}/>
    {isLoaded && (
      <Switch>
        <Route exact path ="/">
            < SpotsIndex />
        </Route>
        <Route path = '/spots/:spotId'>
            <SpotsDetail />
        </Route>
    </Switch>
)}
</>
  )
}

export default App;
