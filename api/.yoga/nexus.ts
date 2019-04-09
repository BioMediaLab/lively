/**
 * This file was automatically generated by Nexus 0.11.3
 * Do not make changes to this file directly
 */

import * as ctx from "../src/context"


declare global {
  interface NexusGen extends NexusGenTypes {}
}

export interface NexusGenInputs {
}

export interface NexusGenEnums {
  CourseRole: "ADMIN" | "ASSISTANT" | "AUDITOR" | "PROFESSOR" | "STUDENT"
}

export interface NexusGenRootTypes {
  Course: { // root type
    description: string; // String!
    id: string; // String!
    name: string; // String!
  }
  CourseUser: { // root type
    id: string; // String!
    role: NexusGenEnums['CourseRole']; // CourseRole!
    user: NexusGenRootTypes['User']; // User!
  }
  Mutation: {};
  Query: {};
  Session: { // root type
    id: string; // ID!
    session?: string | null; // String
    sessionInfo?: string | null; // String
  }
  User: { // root type
    email: string; // String!
    id: string; // ID!
    name: string; // String!
  }
  String: string;
  Int: number;
  Float: number;
  Boolean: boolean;
  ID: string;
}

export interface NexusGenAllTypes extends NexusGenRootTypes {
  CourseRole: NexusGenEnums['CourseRole'];
}

export interface NexusGenFieldTypes {
  Course: { // field return type
    description: string; // String!
    id: string; // String!
    members: NexusGenRootTypes['CourseUser'][]; // [CourseUser!]!
    name: string; // String!
  }
  CourseUser: { // field return type
    course: NexusGenRootTypes['Course']; // Course!
    id: string; // String!
    role: NexusGenEnums['CourseRole']; // CourseRole!
    user: NexusGenRootTypes['User']; // User!
  }
  Mutation: { // field return type
    loginGoogle: NexusGenRootTypes['Session']; // Session!
    logout: NexusGenRootTypes['Session']; // Session!
  }
  Query: { // field return type
    googleRedirect: string; // String!
    myCourses: NexusGenRootTypes['CourseUser'][]; // [CourseUser!]!
    users: NexusGenRootTypes['User'][]; // [User!]!
  }
  Session: { // field return type
    id: string; // ID!
    session: string | null; // String
    sessionInfo: string | null; // String
  }
  User: { // field return type
    email: string; // String!
    id: string; // ID!
    name: string; // String!
  }
}

export interface NexusGenArgTypes {
  Course: {
    members: { // args
      max?: number | null; // Int
    }
  }
  Mutation: {
    loginGoogle: { // args
      code?: string | null; // String
      sessionInfo?: string | null; // String
    }
  }
}

export interface NexusGenAbstractResolveReturnTypes {
}

export interface NexusGenInheritedFields {}

export type NexusGenObjectNames = "Course" | "CourseUser" | "Mutation" | "Query" | "Session" | "User";

export type NexusGenInputNames = never;

export type NexusGenEnumNames = "CourseRole";

export type NexusGenInterfaceNames = never;

export type NexusGenScalarNames = "Boolean" | "Float" | "ID" | "Int" | "String";

export type NexusGenUnionNames = never;

export interface NexusGenTypes {
  context: ctx.Context;
  inputTypes: NexusGenInputs;
  rootTypes: NexusGenRootTypes;
  argTypes: NexusGenArgTypes;
  fieldTypes: NexusGenFieldTypes;
  allTypes: NexusGenAllTypes;
  inheritedFields: NexusGenInheritedFields;
  objectNames: NexusGenObjectNames;
  inputNames: NexusGenInputNames;
  enumNames: NexusGenEnumNames;
  interfaceNames: NexusGenInterfaceNames;
  scalarNames: NexusGenScalarNames;
  unionNames: NexusGenUnionNames;
  allInputTypes: NexusGenTypes['inputNames'] | NexusGenTypes['enumNames'] | NexusGenTypes['scalarNames'];
  allOutputTypes: NexusGenTypes['objectNames'] | NexusGenTypes['enumNames'] | NexusGenTypes['unionNames'] | NexusGenTypes['interfaceNames'] | NexusGenTypes['scalarNames'];
  allNamedTypes: NexusGenTypes['allInputTypes'] | NexusGenTypes['allOutputTypes']
  abstractTypes: NexusGenTypes['interfaceNames'] | NexusGenTypes['unionNames'];
  abstractResolveReturn: NexusGenAbstractResolveReturnTypes;
}