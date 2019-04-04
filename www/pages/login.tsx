import react from "react";
import { WithApolloClient, withApollo } from "react-apollo";
import gql from "graphql-tag";
import { NextContext } from "next";
import { setSessionCookie, getRedirectFrontend } from "../lib/session";

const LOGIN_GOOGLE = gql`
  mutation($code: String!) {
    loginGoogle(code: $code) {
      session
      id
    }
  }
`;

interface Props {
  hasGoogleCode: boolean;
  googleCode?: string;
}

class Login extends react.Component<WithApolloClient<Props>> {
  static async getInitialProps(ctx: NextContext) {
    const response: Props = { hasGoogleCode: false };
    if (ctx.query && ctx.query.code) {
      response.hasGoogleCode = true;
      const code = ctx.query.code;
      if (typeof code === "string") {
        response.googleCode = code;
      } else {
        response.googleCode = code[0];
      }
    }
    return response;
  }

  componentDidMount() {
    if (this.props.hasGoogleCode && this.props.googleCode) {
      this.props.client
        .mutate({
          mutation: LOGIN_GOOGLE,
          variables: { code: this.props.googleCode }
        })
        .then(res => {
          console.log(res);
          if (res.errors) {
            throw new Error("login failed");
          }
          const session: string = res.data.loginGoogle.session;
          setSessionCookie(session);
          const redirect = getRedirectFrontend();
          console.log("redirect time");
          if (redirect) {
            window.location.replace(redirect);
          } else {
            window.location.replace(window.location.origin);
          }
        });
    }
  }

  render() {
    if (this.props.hasGoogleCode) {
      return <div>loading...</div>;
    }
    return <div>Login</div>;
  }
}

export default withApollo(Login);
