import {Route, Switch} from 'react-router-dom'
import {useState, useEffect} from 'react'
import {useDispatch} from 'react-redux'
import * as sessionActions from './store/session'
import Navigation from './components/Navigation'
import SpotsIndex from './components/Spots/index'
import SpotsDetail from './components/Spots/SpotsDetail'
import SpotForm from './components/Spots/SpotForm'
import SpotsCurrent from './components/Spots/SpotsCurrent'
import ManageReviews from './components/Reviews/ManageReviews'
import "./index.css"

function App() {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);
  useEffect(()=> {
    dispatch(sessionActions.restoreUser())
    .then(()=> setIsLoaded(true))
  },[dispatch])

  return (
    < div className = "root">
    <Navigation isLoaded={isLoaded}/>
    {isLoaded && (
      <Switch>
        <Route exact path ="/">
            < SpotsIndex />
        </Route>
        <Route path ='/spots/new'>
          <SpotForm />
        </Route>
        <Route path ='/spots/:spotId/edit'>
          <SpotForm />
        </Route>
        <Route path ='/spots/current'>
          <SpotsCurrent />
        </Route>
        <Route path = '/spots/:spotId'>
            <SpotsDetail />
        </Route>
        <Route path= '/reviews/current'>
            <ManageReviews />
        </Route>
    </Switch>
)}
</div>
  )
}

export default App;
