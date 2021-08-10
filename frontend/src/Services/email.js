import Api from "./api";
import AuthHeader from "./user.service";
import AuthService from "./auth.service";

const EmailService = {
  get: () =>
    Api.get("api/email", { headers: AuthHeader() }).catch((res) =>
      AuthService.verificaErro(res)
    ),
  update: (valores) =>
    Api.put("api/email", valores, { headers: AuthHeader() }).catch((res) =>
      AuthService.verificaErro(res)
    ),
};

export default EmailService;
