import Api from "./api";
import AuthHeader from "./user.service";
import AuthService from "./auth.service";

const CommonService = {
  create: (tipo, valores) =>
    Api.post(`api/${tipo}`, valores, { headers: AuthHeader() }).catch((err) =>
      manipulaErro(err)
    ),
  listAll: (tipo) =>
    Api.get(`api/${tipo}`, { headers: AuthHeader() }).catch((err) =>
      manipulaErro(err)
    ),
  getById: (tipo, id) =>
    Api.get(`api/${tipo}/${id}`, { headers: AuthHeader() }).catch((err) =>
      manipulaErro(err)
    ),
  update: (tipo, id, valores) =>
    Api.put(`api/${tipo}/${id}`, valores, {
      headers: AuthHeader(),
    }).catch((err) => manipulaErro(err)),
  delete: (tipo, id) =>
    Api.delete(`api/${tipo}/${id}`, { headers: AuthHeader() }).catch((err) =>
      manipulaErro(err)
    ),
  deleteDoisId: (tipo, id1, id2) =>
    Api.delete(`api/${tipo}/${id1}/${id2}`, {
      headers: AuthHeader(),
    }).catch((err) => manipulaErro(err)),
};

function manipulaErro(err) {
  if (err.response.status !== 401) {
    return err.response;
  }
  AuthService.verificaErro(err);
}

export default CommonService;
