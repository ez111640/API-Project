import { csrfFetch } from "./csrf";


export const LOAD_REVIEWS = 'reviews/loadReviews'
export const USER_REVIEWS = "reviews/userReviews"
export const REMOVE_REVIEW = 'reviews/removeReview'
const loadReviews = reviews => {
    return {
        type: LOAD_REVIEWS,
        reviews
    }
}

const removeReview = reviewId => ({
    type: REMOVE_REVIEW,
    reviewId
})

export const getCurrentReviews = () => async dispatch => {
    const response = await csrfFetch('/api/reviews/current')
    if (response.ok) {
        const reviews = await response.json();
        dispatch(loadReviews(reviews.Reviews))
        return reviews
    } else {
        const err = await response.json();
        return err;
    }
}



export const getAllReviews = (spotId) => async dispatch => {
    const response = await csrfFetch(`/api/spots/${spotId}/reviews`)
    if (response.ok) {
        const data = await response.json();
        dispatch(loadReviews());
        return data.Reviews;
    }
    else {
        const err = await response.json();
        return err;
    }
}

export const deleteReview = (reviewId) => async dispatch => {
    const response = await csrfFetch(`/api/reviews/${reviewId}`, {
        method: 'DELETE'
    })
    dispatch(removeReview(reviewId))
}

const initialState = {
    reviews: {}
}
const reviewsReducer = (state = initialState, action) => {
    switch (action.type) {
        case LOAD_REVIEWS:
            const reviewsState = { ...state, reviews: { ...state.reviews } };
            action.reviews.forEach(
                (review) => reviewsState.reviews[review.id] = review
            )
            return reviewsState
        case REMOVE_REVIEW:
            const newState = { ...state, reviews: { ...state.reviews } }
            delete newState.reviews[action.reviewId]
            return newState;
        default:
            return initialState;
    }
}


export default reviewsReducer;
