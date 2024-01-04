import React, { useContext, useState } from "react";
import "./SignUp.css";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { Link } from "react-router-dom";
import { signUp } from "../../action/auth";
import { useNavigate } from "react-router-dom";
import { AppContext } from '../../Context/context';

const SignUp = () => {

  const navigate = useNavigate();
  const { setLoading, setAuthUser } = useContext(AppContext)

  const [formData, setFormData] = useState({
    id: "",
    authCrendential: "",
    fullName: "",
    userName: "",
    password: ""
  });

  const handleOnChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }

  const handleOnSubmit = async (e) => {

    setLoading(true);
    e.preventDefault();
    const response = await signUp(formData)

    if (response?.code) {
      alert(response.message);

      setFormData({
        id: "",
        authCrendential: "",
        fullName: "",
        userName: "",
        password: ""
      });
    }
    else if (response?.err) {
      alert('Sign Up Faild! Try Again');

      setFormData({
        id: "",
        authCrendential: "",
        fullName: "",
        userName: "",
        password: ""
      });
    }
    else {
      navigate('/');
      location.reload();
      const { result } = response;
      setAuthUser(result);
    }
    setLoading(false);
  }

  return (
    <div className="sign-in-layout">
      <div className="sign-in-google-section">
        <div className="logo">
          <i
            data-visualcompletion="css-img"
            aria-label="Instagram"
            role="img"
          ></i>
        </div>

        <div className="sign-in-or-section">
          <span className="signup-or-desc">
            Sign up to see photos and videos from your friends.
          </span>
          <div className="form-row sign-in-or-btn">
            <Link to='https://www.facebook.com/login.php?skip_api_login=1&api_key=124024574287414&kid_directed_site=0&app_id=124024574287414&signed_next=1&next=https%3A%2F%2Fwww.facebook.com%2Fdialog%2Foauth%3Fclient_id%3D124024574287414%26locale%3Den_US%26redirect_uri%3Dhttps%253A%252F%252Fwww.instagram.com%252Faccounts%252Fsignup%252F%26response_type%3Dcode%252Cgranted_scopes%26scope%3Demail%26state%3D%257B%2522fbLoginKey%2522%253A%252220hlsf10wqliy5xj1i31m5kp5o1wxfcqr12wery81c7s2oi1bjv1gx%2522%252C%2522fbLoginReturnURL%2522%253A%2522%252Ffxcal%252Fdisclosure%252F%253Fnext%253D%25252F%2522%257D%26ret%3Dlogin%26fbapp_pres%3D0%26logger_id%3D46bb65d1-7b56-479b-b739-060133d1c2f3%26tp%3Dunspecified&cancel_url=https%3A%2F%2Fwww.instagram.com%2Faccounts%2Fsignup%2F%3Ferror%3Daccess_denied%26error_code%3D200%26error_description%3DPermissions%2Berror%26error_reason%3Duser_denied%26state%3D%257B%2522fbLoginKey%2522%253A%252220hlsf10wqliy5xj1i31m5kp5o1wxfcqr12wery81c7s2oi1bjv1gx%2522%252C%2522fbLoginReturnURL%2522%253A%2522%252Ffxcal%252Fdisclosure%252F%253Fnext%253D%25252F%2522%257D%23_%3D_&display=page&locale=en_GB&pl_dbl=0'>
              <Button
                className="facebook-btn form-btn"
                color="primary"
                fullWidth
                variant="contained"
              >
                <span className="facebook-icon"></span>
                Log in with Facebook
              </Button>
            </Link>
          </div>

          <div className="or-line">
            <span className="or-lines"></span>
            <span className="or">OR</span>
            <span className="or-lines"></span>
          </div>
        </div>

        <form action="submit" className="sign-in-from" onSubmit={(e) => handleOnSubmit(e)}>
          <div className="form-row">
            <TextField
              id="outlined-basic"
              label="Mobile number or Email"
              variant="outlined"
              size="small"
              fullWidth
              required
              className="form-text-filds"
              name="authCrendential"
              onChange={(e) => handleOnChange(e)}
              value={formData.authCrendential}
            />
          </div>
          <div className="form-row">
            <TextField
              id="outlined-basic"
              label="Full Name"
              variant="outlined"
              size="small"
              fullWidth
              required
              className="form-text-filds"
              name="fullName"
              onChange={(e) => handleOnChange(e)}
              value={formData.fullName}
            />
          </div>
          <div className="form-row">
            <TextField
              id="outlined-basic"
              label="User Name"
              variant="outlined"
              size="small"
              fullWidth
              required
              className="form-text-filds"
              name="userName"
              onChange={(e) => handleOnChange(e)}
              value={formData.userName}
            />
          </div>
          <div className="form-row">
            <TextField
              id="outlined-basic"
              label="Password"
              variant="outlined"
              size="small"
              fullWidth
              required
              className="form-text-filds"
              name="password"
              onChange={(e) => handleOnChange(e)}
              value={formData.password}
            />
          </div>
          <div className="form-row desc-form-rows">
            <span className="desc-of-signup">
              People who use our service may have uploaded your contact
              information to Instagram. <Link>Learn More</Link>
            </span>
          </div>

          <div className="form-row desc-form-rows">
            <span className="desc-of-signup">
              By signing up, you agree to our <Link>Terms</Link> ,{" "}
              <Link>Privacy Policy</Link> and <Link>Cookies Policy</Link>
            </span>
          </div>

          <div className="form-row">
            <Button
              type="submit"
              className="form-btn"
              color="primary"
              fullWidth
              variant="contained"
            >
              Sign Up
            </Button>
          </div>
        </form>
      </div>

      <div className="dont-ac-section">
        <span className="dont-ac-txt">
          Have an account?
          <Link to="/accounts/login"> Log in</Link>
        </span>
      </div>

      <div className="get-the-app-section">
        <span className="get-the-app-heading">Get the app.</span>
        <div className="app-providers">
          <Link
            target="_blank"
            to="https://play.google.com/store/apps/details?id=com.instagram.android&referrer=ig_mid%3DB6AFB579-CC06-403C-9C48-2EC5D3E0F7AC%26utm_campaign%3DloginPage%26utm_content%3Dlo%26utm_source%3Dinstagramweb%26utm_medium%3Dbadge"
          >
            <Button type="button" className="app-provider">
              <img
                src="https://static.cdninstagram.com/rsrc.php/v3/yz/r/c5Rp7Ym-Klz.png"
                alt="Play Store"
              />
            </Button>
          </Link>

          <Link to="ms-windows-store://pdp/?productid=9nblggh5l9xt&referrer=appbadge&source=www.instagram.com&mode=mini&pos=0%2C0%2C1920%2C1020">
            <Button type="button" className="app-provider">
              <img
                src="https://static.cdninstagram.com/rsrc.php/v3/yu/r/EHY6QnZYdNX.png"
                alt="Microsoft Store"
              />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
