import { Amplify } from 'aws-amplify';
import { generateClient } from 'aws-amplify/api';

const config = {
  "aws_project_region": "us-east-1",
  "aws_appsync_graphqlEndpoint": "https://aoitufplnneuvofjllqckna2hy.appsync-api.us-east-1.amazonaws.com/graphql",
  "aws_appsync_region": "us-east-1",
  "aws_appsync_authenticationType": "API_KEY",
  "aws_appsync_apiKey": "da2-pwcdvgeadbdwlj2idzt4q52d7q",
  "aws_cognito_identity_pool_id": "us-east-1:d950b409-3ed3-441f-840f-1082a97210ee",
  "aws_cognito_region": "us-east-1",
  "aws_user_pools_id": "us-east-1_XcCgHZN5t",
  "aws_user_pools_web_client_id": "1lj2go1iu1mld68biak93ku5e4",
  "oauth": {},
  "aws_cognito_username_attributes": [
      "EMAIL"
  ],
  "aws_cognito_social_providers": [],
  "aws_cognito_signup_attributes": [
      "EMAIL",
      "BIRTHDATE",
      "PHONE_NUMBER"
  ],
  "aws_cognito_mfa_configuration": "OFF",
  "aws_cognito_mfa_types": [
      "SMS"
  ],
  "aws_cognito_password_protection_settings": {
      "passwordPolicyMinLength": 8,
      "passwordPolicyCharacters": [
          "REQUIRES_LOWERCASE",
          "REQUIRES_NUMBERS",
          "REQUIRES_SYMBOLS",
          "REQUIRES_UPPERCASE"
      ]
  },
  "aws_cognito_verification_mechanisms": [
      "EMAIL"
  ],
  "aws_user_files_s3_bucket": "leads-up-storage-prod-ab54e87f154512-staging",
  "aws_user_files_s3_bucket_region": "us-east-1"
}

export interface PayloadQuery {
  query: any;
  variables?: any;
  authToken?: string;
}

const client = generateClient();

const graphql = (
  { authToken, query, variables }: PayloadQuery,
  isNewClient = false,
) => {
  if (isNewClient) {
    return generateClient().graphql({ query, variables, authToken }) as any;
  }
  return client.graphql({
    query,
    variables,
    authToken,
  }) as any;
};

const configure = () => {
  Amplify.configure({...config});
};

export const Connector = {
  graphql,
  configure
};
