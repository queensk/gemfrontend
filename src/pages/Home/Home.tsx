import React, { useEffect, useState } from "react";
// import Profile from "../../Components/Profile/profile";
import "./Home.css";
import api from "../../api/api";
import Stats from "../../Components/Stats/Stats";
import PopupInput from "../../Components/Gem/Gem";
import { AuthContext } from "../../UseContext/UseAuth/UseAuth";
import Spinner from "../../Components/Spinner/Spinner";

interface User {
  Biography: string | null;
  Email: string;
  ProfilePicture: string | null;
  UserID: string;
  Username: string;
  NumberOfFollowers: number;
  NumberOfLikes: number;
}
interface UserPortfolio {
  PortfolioID: string;
  Title: string;
  Description: string;
  UserID: string;
}

const Home: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [usersPortfolio, setUserPortfolio] = useState<UserPortfolio[]>([]);
  const [showPopup, setShowPopup] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { state } = React.useContext(AuthContext);

  const handleOpenPopup = () => {
    setShowPopup(true);
  };

  const handleClosePopup = () => {
    setShowPopup(false);
  };

  const handleCreatePortfolio = (title: string, description: string) => {
    setIsLoading(true);
    const data = {
      userID: state.user?.userID,
      title: title,
      description: description,
    };

    api
      .post("/portfolio", data, {
        headers: {
          Authorization: `JWT ${state.token}`,
        },
      })
      .then((res) => {
        setIsLoading(false);
        console.log(res.data.data);
      })
      .catch((err) => {
        console.log(err);
        setIsLoading(false);
      });

    setShowPopup(false);
  };
  const handleGetProfile = () => {
    setIsLoading(true);
    api
      .get("/users", {
        headers: {
          Authorization: `JWT ${state.token}`,
        },
      })
      .then((res) => {
        setUsers(res.data.data);
        setIsLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setIsLoading(false);
      });
  };
  const handleGetPortfolio = () => {
    setIsLoading(true);
    api
      .get("/portfolio", {
        headers: {
          Authorization: `JWT ${state.token}`,
        },
      })
      .then((res) => {
        setUserPortfolio(res.data.data);
        setIsLoading(false);
      })
      .then((err) => {
        console.log(err);
        setIsLoading(false);
      });
  };
  useEffect(() => {
    handleGetProfile();
    handleGetPortfolio();
  }, []);
  return (
    <main className="main_home_section">
      {isLoading ? (
        <Spinner />
      ) : (
        <>
          <div className="show_profiles">
            {users.length > 0 &&
              users.map((user) => (
                <div className="show_profile_data">
                  <div className="show_profile_picture">
                    <img
                      src={
                        user.ProfilePicture ||
                        "https://www.w3schools.com/howto/img_avatar.png"
                      }
                      alt="Profile Picture"
                    />
                    <h1>{user.Username}</h1>
                  </div>
                  <div>
                    <p>{user.Biography}</p>
                  </div>
                  <Stats
                    user={user}
                    likes={user.NumberOfLikes}
                    followers={user.NumberOfFollowers}
                  />
                </div>
              ))}
          </div>
          <div className="user_more_data">
            {/* <Profile user={user} /> */}
            <div className="user_more_data_input">
              <button onClick={handleOpenPopup}>Gem</button>
              {showPopup && (
                <PopupInput
                  onClose={handleClosePopup}
                  onSubmit={handleCreatePortfolio}
                />
              )}
            </div>
            <div className="user_portfolio">
              {usersPortfolio.length > 0 &&
                usersPortfolio.map((userPortfolio) => (
                  <div className="user_portfolio_item">
                    <h1>{userPortfolio.Title}</h1>
                    <p>{userPortfolio.Description}</p>
                  </div>
                ))}
            </div>
          </div>
        </>
      )}
    </main>
  );
};

export default Home;
