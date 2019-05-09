import { DefaultTheme } from "styled-components";

export enum ThemeType {
  Light
}

export const getTheme = (type: ThemeType): DefaultTheme => {
  switch (type) {
    default:
      return {
        colors: {
          background: {
            primary: "#f4f4f4",
            secondary: "#c4c4c4",
            overlay: "#a1a2b760"
          },
          text: {
            primary: "#2d2d2d",
            secondary: "#515151",
            disabled: "#706161"
          },
          main: {
            primary: "#FFFFFF",
            secondary: "#DEDEDE",
            accent: "#FF4B8B",
            altAccent: "orange",
            disabled: "#c9c9c9"
          },
          extra: {
            error: {
              body: "#ff2b2b",
              text: "#000000"
            }
          }
        },
        text: {
          family: "sans-serif"
        }
      };
  }
};
