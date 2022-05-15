import axios from 'axios'

/* ACTION TYPES */
const TOKEN = 'token'
const SET_USERACTIVITY = "SET_USERACTIVITIES"
const POST_USERACTIVITY = "POST_USERACTIVITY"

/* ACTION CREATORS */
export const _postUserActivity = (userActivity) => {
    return{
        type: POST_USERACTIVITY,
        userActivity
    }
}

export const _setUserActivities = (userActivities) => {
    return{
        type: SET_USERACTIVITY,
        userActivities
    }
}

/* THUNKS */
export const getUserActivities = () => {
    return async (dispatch) => {
        const token = window.localStorage.getItem(TOKEN);
        const {data} = await axios.get(`/api/activities/users`,{
            headers: {
              authorization: token
            }
          });
          dispatch(_setUserActivities(data))
    }
}

/* REDUCER */
const initialState = [];
const userActivitiesReducer = (state = initialState, action) => {
    switch(action.type){
        case SET_USERACTIVITY:
            return action.userActivities
        default:
            return state;
    }
}

export default userActivitiesReducer