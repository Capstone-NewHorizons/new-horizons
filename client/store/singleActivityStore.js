import axios from "axios";

const TOKEN = "token";

const SET_SINGLE = "SET_SINGLE_ACTIVITY";

const _setSingleActivity = (activity) => {
  return {
    type: SET_SINGLE,
    activity,
  };
};

export const fetchSingleActivity = (id) => {
  return async (dispatch) => {
    try {
      const token = window.localStorage.getItem(TOKEN);
      const {data} = await axios.get(`/api/activities/${id}`,{
        headers: {
          authorization: token
        }
      }
      );
      console.log(data)
      dispatch(_setSingleActivity(data))
    } catch (err) {
      console.log(err)
    }
  }
};

export const postUserActivity = (activityId,score) => {
  const token = window.localStorage.getItem(TOKEN)
  return async (dispatch) => {
      const {data} = await axios.post("/api/activities/useractivity",
      {
          activityId: activityId,
          score: score
      },
      {
          headers: {
              authorization: token
            },
      },
      )
      dispatch(_setSingleActivity(data))
  }
}

export const putUserActivity = (activityId,score) => {
  const token = window.localStorage.getItem(TOKEN)
  return async (dispatch) => {
      const {data} = await axios.put("/api/activities/useractivity",
      {
          activityId: activityId,
          score: score
      },
      {
          headers: {
              authorization: token
            },
      },
      )
      dispatch(_setSingleActivity(data))
  }
}




const initialState = {};
const singleActivityReducer = (state = initialState, action) => {
  //console.log("Action!!", action)
  switch (action.type) {
    case SET_SINGLE:
      return action.activity;
    default:
      return state;
  }
}

// const initialState = {}
// export default function singleStudentReducer(state = initialState, action) {
//   switch (action.type) {
//     case SET_SINGLE:
//       return action.student
//     default:
//       return state
// }}

export default  singleActivityReducer
