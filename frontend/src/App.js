import {Route, Switch} from 'react-router-dom'
import {useState, useEffect} from 'react'
import {useDispatch} from 'react-redux'
import * as sessionActions from './store/session'
import Navigation from './components/Navigation'
import SpotsIndex from './components/Spots/index'
import SpotsDetail from './components/Spots/SpotsDetail'
import SpotForm from './components/Spots/SpotForm'
import ReviewIndex from './components/Reviews/ReviewIndex'
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
        <Route path ='/spots/edit'>
          <SpotForm />
        </Route>
        <Route path ='/spots/:spotId/reviews'>
          <ReviewIndex />
          </Route>
        <Route path = '/spots/:spotId'>
            <SpotsDetail />
        </Route>
    </Switch>
)}
</div>
  )
}

export default App;
