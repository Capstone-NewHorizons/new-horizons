import React, {useRef, useCallback, useEffect} from "react";
import { useDispatch, useSelector } from "react-redux";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { fetchUser, updateUser } from "../store/SingleUserStore";
import { fetchActivities} from "../store/allActivitiesStore";
import { getUserActivities } from "../store/userActivitiesStore";
import {fetchFriends, deleteFriend} from "../store/friendsStore"
import MappedActivity from "./utilities/MappedActivity";
import aws from "aws-sdk"
import axios from "axios";

const AWS_ACCESS_KEY_ID="AKIAYQC73EU7UC6KESI5"
const AWS_DEFAULT_REGION="us-east-1"
const AWS_SECRET_ACCESS_KEY="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"
const S3_BUCKET="new-horizons-app-assets"

aws.config.update({
  region: AWS_DEFAULT_REGION,
  accessKeyId: AWS_ACCESS_KEY_ID,
  secretAccessKey: AWS_SECRET_ACCESS_KEY
})

const UserProfile = (props) => {
  const user = useSelector( state => state.user )
  const friends = useSelector( state => state.friends )
  const userActivities = useSelector( state => state.userActivities.reverse() )
  const recent5 = userActivities.slice(0,5)

  const fileInput = useRef()
  const profilePicture = useRef()

  useEffect( () => {
    dispatch(fetchActivities())
    dispatch(fetchUserData(props.match.params.id))
    dispatch(fetchFriends(props.match.params.id))
    dispatch(getUserActivities())
  }, [input])

  // componentDidMount() {
  //   this.props.fetchUserData(this.props.match.params.id);
  //   this.props.fetchFriends(this.props.match.params.id);
  //   this.props.fetchActivities()
  //   this.props.getUserActivities()
  // }

  const handleSubmit = useCallback( async(e) => {
    e.preventDefault()
    const s3 = new aws.S3()
    const file = fileInput.current.files[0]
    const pictureKey = "photos/profile_picture_" + this.props.userData.id + file.name.slice( file.name.indexOf('.') )
    const uploadParams = {
      Bucket: S3_BUCKET,
      Key: pictureKey,
      Body: file,
      ACL: 'public-read'
    };
    const newUrl = `https://new-horizons-app-assets.s3.us-east-1.amazonaws.com/${pictureKey}`
    try {
      const data = await s3.putObject(uploadParams).promise();
      this.props.updateUserData( {...userData, imageUrl: newUrl} )
      profilePicture.src = newUrl
      console.log("Successful Upload", data);
    } catch (err) {
      console.log("Error", err);
    }
  })

  // const user = this.props.userData;
  //   const friends = this.props.friends;
  //   const userActivities = this.props.userActivities.reverse()

  return (
      <div>
      <div>
        {user ? (
          <div key={user.id}>
            <div className="singleActivity-image">
            <img className="resize" src= {user.imageUrl}/>
            </div>
            <h2>USER: {user.username}</h2>
            <h2>USER EMAIL: {user.email}</h2>
            <img id="preview" src={user.imageUrl} ref={profilePicture}/>
            <form onSubmit={handleSubmit}>
              <input type="file" ref={fileInput}/>
              <button type="submit"> Upload New Picture </button>
            </form>
            {/* <div><img src= {user.imageUrl}/></div> */}
           {/* <div> <Link to={`/user/modify/${this.props.match.params.id}`}>Modify </Link></div> */}
           <h1>5 MOST RECENT ACTIVITIES:</h1>
           <div id="allActivities">
        {recent5.map((activity) => {
          return(
            <div key={activity.id}>
            <Link to ={`/activities/${activity.id}`}>
            <img src= {activity.imageUrl} className="singleItem-image"/>
            <div>
                <h3>{activity.name}</h3>
            </div>
        </Link>

            {/* // <div key={activity.id} className="activity-x">
            // <h1>{activity.name}</h1>
            // </div> */}
            </div>
          )
         })}
      </div>

           </div>
           )
      : (
        "There is no user data"
      )}
    </div>
    <div className="module">
    <h2><Link to={`/addfriends/${this.props.match.params.id}`}>Add Friends</Link>
    </h2>
    <h2>Friends List:</h2>
    <div> {friends.map((friend) => {
          return (
            <div key={friend.id}>
            <Link to={`/usersfriends/${friend.friendId}`} key={friend.id}>
            <div className="friend" key={friend.id}>
            <h2 className="name">{friend.username}</h2>
            </div>
            </Link>
             <form onSubmit={(ev) => ev.preventDefault()}>
               <div className= "remove"></div>
             <button
             type="submit"
               className= "x-button"
               onClick={() => this.props.deleteFriend(friend.id)}
             >
               Remove Friend
             </button>
             </form>
               </div>
          );
        })}
        </div>
        </div>
    </div>
    )
}

const mapState = (state) => {
  return {
    userData: state.user,
    friends: state.friends,
    activities: state.activities,
    userActivities: state.userActivities
  };
};

const mapDispatch = (dispatch, { history }) => {
  return {
    fetchUserData: (id) => dispatch(fetchUser(id)),
    updateUserData: (id) => dispatch(updateUser(id)),
    fetchFriends: (id) => dispatch(fetchFriends(id)),
    deleteFriend: (id) => dispatch(deleteFriend(id)),
    fetchActivities: () => dispatch(fetchActivities()),
    getUserActivities: () => dispatch(getUserActivities())
  };
};

export default connect(mapState, mapDispatch)(UserProfile);
