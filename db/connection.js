import Orm from "./Orm.js";

export const ormObject = new Orm();
await ormObject.connect();
export const orm = ormObject.instance;
