import FacebookLoginLib from "react-facebook-login";
import useUserStore from "../store/userStore";
import { FB_APP_ID } from "../util/config";

const FacebookLogin = FacebookLoginLib.default || FacebookLoginLib;

export default function LoginFacebook() {
  const loginFacebookApi = useUserStore((state) => state.loginFacebookApi);

  const responseFacebook = (response) => {
    if (!response.accessToken) return;
    loginFacebookApi(response.accessToken).catch((err) => console.log(err));
  };

  return (
    <div>
      <FacebookLogin
        appId={FB_APP_ID}
        autoLoad={true}
        fields="name,email,picture"
        callback={responseFacebook}
        version="23.0"
        cssClass="btn-facebook"
        containerStyle={{ display: "block" }}
        textButton="Continue with Facebook"
        icon={<span className="fb-icon">f</span>}
      />
    </div>
  );
}
