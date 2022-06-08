import React, { createContext, useRef } from "react";
import { CognitoUser, AuthenticationDetails } from "amazon-cognito-identity-js";
import Pool from './UserPool'

const AccountContext = createContext();

const Account = props => {
  
  const cognitoUser = useRef();
  const userAttributesRef = useRef();

  const getSession = async () => 
    await new Promise((resolve, reject) => {
      const user = Pool.getCurrentUser();
      if (user) {
        user.getSession((err, sesssion) => {
          if (err) {
            reject();
          } else {
            resolve(sesssion);
          }
        })
      } else {
        reject();
      }
    });

	const authenticate = async (Username, Password) => 
    await new Promise((resolve, reject) => {
      cognitoUser.current = new CognitoUser({ Username, Pool });
      const authDetails = new AuthenticationDetails({ Username, Password });

      cognitoUser.current.authenticateUser(authDetails, {
        onSuccess: data => {
          console.log("onSuccess:", data);
          resolve(["loggedIn", data]);
        },

        onFailure: err => {
          console.error("onFailure:", err);
          reject(err);
        },

        newPasswordRequired: (userAttributes, requiredAttributes) => {
          console.log("newPasswordRequired:", userAttributes, requiredAttributes);
          console.log(typeof userAttributes);
          delete userAttributes.email_verified;
          delete userAttributes.email;
          delete userAttributes['custom:tenantId'];
          userAttributesRef.current = userAttributes;
          resolve(["newPasswordRequired", userAttributes]);
        }
      });
    });

  const logout = () => {
    const user = Pool.getCurrentUser();
    if (user) {
      user.signOut();
    }
  }

  const completeNewPasswordChallenge = async (NewPassword) => {
    await new Promise((resolve, reject) => {
      console.log(userAttributesRef.current)
      cognitoUser.current.completeNewPasswordChallenge(NewPassword, userAttributesRef.current, { 
        onFailure: (err) => {
          console.error('onFailure:', err);
          reject(err);
        },
        onSuccess: (result) => {
          console.log('call result: ', result);
          resolve(result);
        }
      });
    });
  }


	return (
		<AccountContext.Provider value={{
      authenticate, getSession, logout, completeNewPasswordChallenge
    }}>
			{props.children}
		</AccountContext.Provider>
  );
};

export { Account, AccountContext };