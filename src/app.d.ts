// app.d.ts

/// <reference types="lucia" />
declare namespace Lucia {
  type Auth = import("./server/auth/lucia.ts").Auth;
  type DatabaseUserAttributes = {
    name: string;
    email: string;
    image?: string;
  };
  type DatabaseSessionAttributes = {
    //...
  };
}
