import React from "react";
import { NextContext, NextComponentType } from "next";
import Layout from "../components/Layout";
import { getSessionCookie } from "./session";

const makePage = (Comp: NextComponentType) => {
  const newComp = ({
    hasSession,
    compProps
  }: {
    hasSession: boolean;
    compProps: any;
  }) => (
    <Layout hasSession={hasSession}>
      <Comp {...compProps} />
    </Layout>
  );

  newComp.getInitialProps = async (ctx: NextContext) => {
    const hasSession = getSessionCookie(ctx) ? true : false;
    let compProps = {};
    if (Comp.getInitialProps) {
      compProps = await Comp.getInitialProps(ctx);
    }

    return {
      hasSession,
      compProps
    };
  };

  return newComp;
};

export default makePage;
