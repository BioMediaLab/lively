import "styled-components";

// extend the styled-components declaration with
// our own theme
declare module "styled-components" {
  export interface DefaultTheme {
    colors: {
      background: {
        primary: string;
        secondary: string;
        overlay: string;
      };
      text: {
        primary: string;
        secondary: string;
        disabled: string;
      };
      main: {
        primary: string;
        secondary: string;
        accent: string;
        altAccent: string;
        disabled: string;
      };
      extra: {
        error: {
          body: string;
          text: string;
        };
      };
    };
    text: {
      family: string;
    };
  }
}
