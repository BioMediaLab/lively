import { NextAppContext } from "next/app";
import { addHours } from "date-fns";

const parseCookie = (cookieString: string): { [key: string]: string } => {
  const splitsCookieParts = [];
  let acc: string[] = [];
  Array.from(cookieString).forEach(char => {
    if (char === " ") {
      return;
    }
    if (char === "=" || char === ";") {
      splitsCookieParts.push(acc.join(""));
      acc = [];
      return;
    }
    acc.push(char);
  });
  splitsCookieParts.push(acc.join(""));

  if (splitsCookieParts.length === 0 || splitsCookieParts.length % 2 !== 0) {
    return {};
  }

  const keyValGroups: string[][] = [];
  splitsCookieParts.forEach((part, index, arr) => {
    if (index % 2 === 0) {
      keyValGroups.push([part, arr[index + 1]]);
    }
  });

  const result = Object.create({});
  keyValGroups.forEach(([name, val]) => {
    result[name] = val;
  });
  return result;
};

export const getSessionCookie = (ctx: NextAppContext) => {
  let cookies;
  if (ctx.ctx.req && ctx.ctx.req.headers && ctx.ctx.req.headers.cookie) {
    let cookieData = ctx.ctx.req.headers.cookie;
    if (typeof cookieData === "object") {
      cookieData = cookieData[0];
    }
    cookies = parseCookie(cookieData);
  } else if (process.browser) {
    cookies = parseCookie(document.cookie);
  } else {
    return false;
  }
  return cookies.session ? cookies.session : false;
};

export const deleteSessionFrontend = () => {
  if (!process.browser) {
    throw new Error("attempting to delete cookie on the server.");
  }
  document.cookie = "session= ; expires = Thu, 01 Jan 1970 00:00:00 GMT";
};

const setCookieFrontend = (
  name: string,
  val: string,
  hoursToExpire: number
) => {
  const exp = addHours(new Date(), hoursToExpire);
  const cstring = `${name}=${val}; expires=${exp.toUTCString()}`;
  document.cookie = cstring;
};

export const setRedirCookie = () => {
  // lets base64 encode the path so weird chars don't mess things up
  const val = btoa(window.location.href);
  setCookieFrontend("login_redir", val, 1);
};

export const setSessionCookie = (session: string) => {
  // 24 hours * 30 days = 1 month
  setCookieFrontend("session", session, 24 * 30);
};

export const getRedirectFrontend = () => {
  const cookies = parseCookie(document.cookie);
  if (cookies.login_redir) {
    return atob(cookies.login_redir);
  }
  return false;
};
