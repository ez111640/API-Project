import { csrfFetch } from "./csrf";


export const LOAD_REVIEWS = 'reviews/loadReviews'
// export const LOAD_REVIEW = 'reviews/loadReview'
// export const ADD_REVIEW = 'reviews/addReview'



const loadReviews = reviews => {
    return {
        type: LOAD_REVIEWS,
        reviews
    }
}

// const loadReview = review => ({
//     type: LOAD_REVIEW,
//     review
// })

// const addReview = review => ({
//     type: ADD_REVIEW,
//     review
// })


export const getAllReviews = (spotId) => async dispatch => {
    const response = await csrfFetch(`/api/spots/${spotId}/reviews`)
    if(response.ok) {
        const data = await response.json();
        dispatch(loadReviews(data.Reviews));
        return data.Reviews;
    }
    else {
        const err = await response.json();
        return err;
    }
}

const initialState = {
    reviews: {}
}
const reviewsReducer = (state=initialState, action) =>
{
    switch(action.type)
    {case LOAD_REVIEWS:
        const reviewsState = {...state, reviews: {...state.reviews}};
        console.log(action)
        action.reviews.forEach(
            (review) => reviewsState.reviews[review.id] = review
        )
        return reviewsState
    default:
    return initialState;
    }
}


export default reviewsReducer;
