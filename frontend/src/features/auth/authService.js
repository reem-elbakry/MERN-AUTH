import axios from "axios";

// const API_URL = "/api/users/";

//login user
const login = async (userData) => {
  const response = await axios.post("/api/users/login", userData);

  if (response.data) {
    localStorage.setItem("user", JSON.stringify(response.data.data)); //token
  }

  return response.data;
};

const authService = {
  login,
};

export default authService;
