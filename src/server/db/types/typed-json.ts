import { customType } from "drizzle-orm/mysql-core";

export const typedJson = <TData, TName extends string = string>(name: TName) =>
  customType<{ data: TData; default: true }>({
    dataType() {
      return "json";
    },
    toDriver(value: TData) {
      if (!value) return null;
      return JSON.stringify(value);
    },
    fromDriver(value: unknown) {
      if (value === null || value === undefined) {
        return null as TData;
      }

      if (typeof value === "object") {
        return value as TData;
      }

      if (typeof value !== "string") {
        throw new Error(
          `Typed JSON type expected a string, but received ${typeof value}`,
        );
      }

      return JSON.parse(value) as TData;
    },
  })(name);
