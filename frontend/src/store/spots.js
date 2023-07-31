import { csrfFetch } from './csrf'
export const LOAD_SPOTS = 'spots/loadSpots'
export const LOAD_SPOT = 'spots/loadSpot'
export const ADD_SPOT = 'spots/addSpot'
export const REMOVE_SPOT = 'spots/removeSpot'
export const UPDATE_SPOT = 'spots/updateSpot'

export const loadSpots = spots => {
    return {
        type: LOAD_SPOTS,
        spots
    }
}

const loadSpot = spot => ({
    type: LOAD_SPOT,
    spot
})

const addSpot = spot => ({
    type: ADD_SPOT,
    payload: spot
})

const removeSpot = spotId => ({
    type: REMOVE_SPOT,
    payload: spotId
})

const updateSpot = spot => ({
    type: UPDATE_SPOT,
    payload: spot
})

export const getAllSpots = () => async dispatch => {
    const response = await csrfFetch('/api/spots')
    if (response.ok) {
        const spots = await response.json();
        dispatch(loadSpots(spots.Spots));
        return spots;
    } else {
        const err = await response.json();
        return err;
    }
}
export const getOneSpot = (spotId) => async dispatch => {
    const response = await csrfFetch(`/api/spots/${spotId}`)
    if (response.ok) {
        const spot = await response.json();
        dispatch(loadSpot(spot))
    } else {
        const err = await response.json();
        return err;
    }
}

export const postSpot = (spot) => async dispatch => {
    const response = await fetch(`/api/spots`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application.json'
        },
        body: JSON.stringify(spot)
    })
    if (response.ok) {
        const newSpot = await response.json();
        dispatch(addSpot(newSpot))
        return newSpot;
    }
}

export const editSpot = (spot) => async dispatch => {
    const response = await fetch(`/api/spots/${spot.id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(spot)
    })
    if (response.ok) {
        const updatedSpot = await response.json();
        dispatch(updateSpot(updatedSpot))
        return updatedSpot
    } else {
        const err = await response.json();
        return err;
    }
}

export const deleteSpot = (spotId) => async dispatch => {
    const response = await fetch(`/api/spots/${spotId}`,
        {
            method: 'DELETE'
        })
    if (response.okay) {
        dispatch(removeSpot(spotId))
    } else {
        const err = await response.json();
        return err;
    }
}
const initialState = {
    spots:{},
    spot: {}
}


const spotsReducer = (state = initialState, action) => {
    switch (action.type) {
        case LOAD_SPOTS:
            const spotsState = {...state, spots: {...state.spots} };
            action.spots.forEach(
                (spot) => spotsState.spots[spot.id] = spot
            )
            return spotsState
        case LOAD_SPOT :
            return {...state, [action.spot.id]: action.spot}

        default:
            return initialState;
    }
}

export default spotsReducer;


// case UPDATE_SPOT:
//     return {...state, [action.spot.id]: action.spot}
// case REMOVE_SPOT:
//     const newState = { ...state }
//     delete newState[action.stateId]
//     return newState
