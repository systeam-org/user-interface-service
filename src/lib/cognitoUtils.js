import { CognitoAuth } from "amazon-cognito-auth-js/dist/amazon-cognito-auth";
import { CognitoUserPool } from "amazon-cognito-identity-js";
import { config as AWSConfig } from "aws-sdk";
import appConfig from "../config/app-config.json";

AWSConfig.region = appConfig.region;

// Creates a CognitoAuth instance
const createCognitoAuth = () => {
  const appWebDomain = appConfig.userPoolBaseUri
    .replace("https://", "")
    .replace("http://", "");
  const auth = new CognitoAuth({
    UserPoolId: appConfig.userPool,
    ClientId: appConfig.clientId,
    AppWebDomain: appWebDomain,
    TokenScopesArray: appConfig.tokenScopes,
    RedirectUriSignIn: appConfig.callbackUri,
    RedirectUriSignOut: appConfig.signoutUri
  });
  return auth;
};


const createCognitoAuthForVendor = () => {
  const appWebDomain = appConfig.userPoolBaseUri
    .replace("https://", "")
    .replace("http://", "");
  const auth = new CognitoAuth({
    UserPoolId: appConfig.userpoolForVendor,
    ClientId: appConfig.clientId,
    AppWebDomain: appWebDomain,
    TokenScopesArray: appConfig.tokenScopes,
    RedirectUriSignIn: appConfig.callbackUri,
    RedirectUriSignOut: appConfig.signoutUri
  });
  return auth;
};
// Creates a CognitoUser instance
const createCognitoUser = () => {
  const pool = createCognitoUserPool();
  return pool.getCurrentUser();
};
const createCognitoUserVendor = () => {
  const pool = createCognitoUserPoolForVendor();
  return pool.getCurrentUser();
};

// Creates a CognitoUserPool instance
const createCognitoUserPool = () =>
  new CognitoUserPool({
    UserPoolId: appConfig.userPool,
    ClientId: appConfig.clientId
  });

const createCognitoUserPoolForVendor = () =>
new CognitoUserPool({
  UserPoolId: appConfig.userPoolForVendor,
  ClientId: appConfig.clientIdForVendor
});

// Get the URI of the hosted sign in screen
const getCognitoSignInUri = () => {
  const signinUri = `${appConfig.userPoolBaseUri}/login?response_type=token&scope=aws.cognito.signin.user.admin+email+openid+phone+profile&client_id=${appConfig.clientId}&redirect_uri=${appConfig.callbackUri}`;
  return signinUri;
};

const getCognitoSignInUriForVendor = () => {
  const signinUri = `${appConfig.userPoolBaseUriForVendor}/login?response_type=token&scope=aws.cognito.signin.user.admin+email+openid+phone+profile&client_id=${appConfig.clientIdForVendor}&redirect_uri=${appConfig.callBackUriForVendor}`;
  return signinUri;
};
// Gets a new Cognito session. Returns a promise.
const getCognitoSession = () => {
  return new Promise((resolve, reject) => {
    const cognitoUser = createCognitoUser();
    cognitoUser.getSession((err, result) => {
      if (err || !result) {
        reject(new Error("Failure getting Cognito session: " + err));
        return;
      }

      // Resolve the promise with the session credentials
      console.debug("Successfully got session: " + JSON.stringify(result));

      let isAdmin = false;
      console.log("@group", result);
      console.log("groups: " + result.idToken.payload["cognito:groups"]);
      if (
        result.idToken.payload["cognito:groups"] == "cmpe281-project1-admin"
      ) {
        isAdmin = true;
      }
      const session = {
        credentials: {
          accessToken: result.accessToken.jwtToken,
          idToken: result.idToken.jwtToken,
          refreshToken: result.refreshToken.token
        },
        user: {
          userName: result.idToken.payload["cognito:username"],
          email: result.idToken.payload.email,
          firstName: result.idToken.payload.given_name,
          lastName: result.idToken.payload.family_name,
          isAdmin: isAdmin
        }
      };
      resolve(session);
    });
  });
};

// Sign out of the current session (will redirect to signout URI)
const signOutCognitoSession = () => {
  const auth = createCognitoAuth();
  auth.signOut();
};
const signOutCognitoSessionVendor = () => {
  const auth = createCognitoAuthForVendor();
  auth.signOut();
};

export default {
  createCognitoAuth,
  createCognitoUser,
  createCognitoUserPool,
  getCognitoSession,
  getCognitoSignInUri,
  signOutCognitoSession,
  signOutCognitoSessionVendor,
  createCognitoUserPoolForVendor,
  getCognitoSignInUriForVendor,
  createCognitoUserVendor,
  createCognitoAuthForVendor
};
