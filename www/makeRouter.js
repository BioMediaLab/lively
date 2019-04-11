const React = require("react");
const Link = require("next/link");
const Router = require("next/router");

const createRoute = (page, path) => {
  const paramHelper = new Map();
  path
    .split("/")
    .map((str, index) => {
      if (str[0] !== ":") {
        return false;
      }
      return {
        key: str.substring(1),
        index
      };
    })
    .filter(piece => (piece ? true : false))
    .forEach(({ index, key }) => {
      paramHelper.set(index, key);
    });

  const parsePath = curPath => {
    // trailling slashes break Next
    if (curPath[curPath.length - 1] === "/") {
      curPath = curPath.substring(0, curPath.length - 1);
    }
    const getParams = curPath
      .split("/")
      .map((part, index) => {
        if (!paramHelper.has(index)) {
          return "";
        }
        return `${paramHelper.get(index)}=${part}`;
      })
      .join("");

    return {
      href: `/${page}?${getParams}`,
      as: curPath
    };
  };

  return {
    Link: ({ path, children, ...props }) =>
      React.createElement(
        Link.default,
        {
          ...parsePath(path),
          ...props
        },
        children
      ),
    push: path => {
      const opts = parsePath(path);
      Router.default.push(opts.href, opts.as);
    },
    _serverRoute: {
      page,
      path
    }
  };
};

const handleServerRequest = (routes, server, app) => {
  const handle = app.getRequestHandler();

  Object.keys(routes).forEach(key => {
    const props = routes[key]._serverRoute;
    server.get(props.path, (req, res) => {
      return app.render(req, res, props.page, req.params);
    });
  });

  server.get("*", (req, res) => {
    return handle(req, res);
  });
};

module.exports = { createRoute, handleServerRequest };
