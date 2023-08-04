import { csrfFetch } from "./csrf";


export const LOAD_REVIEWS = 'reviews/loadReviews'
export const USER_REVIEWS = "reviews/userReviews"
export const REMOVE_REVIEW = 'reviews/removeReview'
export const ADD_REVIEW = "reviews/addReview"
export const EDIT_REVIEW = "reviews/editReview"

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

const addReview = review => ({
    type: ADD_REVIEW,
    review
})

const editReview = review => ({
    type: EDIT_REVIEW,
    review
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
        const reviews = await response.json();
        await dispatch(loadReviews(reviews.Reviews));
        return reviews;
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

export const postReview = (spot, reviewInfo) => async dispatch => {
    console.log(spot.id)
    const { review, stars } = reviewInfo
    const response = await csrfFetch(`/api/spots/${spot.id}/reviews`,
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(reviewInfo)
        }
    )

    if (response.ok) {
        const newReview = await response.json();
        await dispatch(addReview(newReview))
        return newReview;

    } else {
        const err = await response.json();
        return err;
    }
}

export const updateReview = (id, review) => async dispatch => {
    const response = await csrfFetch(`/api/reviews/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(review)
    })
    if (response.ok) {
        const newReview = await response.json();
        dispatch(editReview(review))
        return newReview
    } else {
        const err = response.json();
        return err;
    }
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
        case ADD_REVIEW:
            const newReviewState = { ...state, reviews: { ...state.reviews } }
            newReviewState.reviews[action.review.id] = action.review;
            return newReviewState
        case EDIT_REVIEW:
                const updateReviewState = {...state, review: {...state.reviews}}
                updateReviewState.reviews[action.review.id] = action.review;
                return updateReviewState;
        default:
            return initialState;
    }
}


export default reviewsReducer;
