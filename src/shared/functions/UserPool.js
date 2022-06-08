import { CognitoUserPool } from 'amazon-cognito-identity-js';

const poolData = {
  UserPoolId: 'us-east-2_otZbjHVVF',
  ClientId: 'bfjnlho391q8vgc4ghs56l9qo'
};

export default new CognitoUserPool(poolData);