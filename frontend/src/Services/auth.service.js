import Api from "./api";

const login = (usuario) => {
  return Api.post("auth/login", usuario).then((response) => {
    if (response.data.token) {
      localStorage.setItem("user", JSON.stringify(response.data));
    }
    return response.data;
  }).catch((err) => {
    if(err.response && err.response.status === 401) {
      return "Nome de usuário ou senha incorretos!"
    }
    return "Falha na tentativa de login.";
  });
};

const logout = () => {
  localStorage.removeItem("user");
};

const getCurrentUser = () => {
  return JSON.parse(localStorage.getItem("user"));
};

const isLoggedIn = () => {
  return localStorage.getItem("user") !== null;
};

const verificaErro = (res) => {
  if (res.response.data.auth === false) {
    localStorage.setItem("messageLogin", "Login expirado ou inválido");
    logout();
    window.location.reload();
  }
};

const auth = {
  login,
  logout,
  getCurrentUser,
  isLoggedIn,
  verificaErro,
};
export default auth;