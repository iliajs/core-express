import Orm from "./Orm.js";

const ormObject = new Orm();
await ormObject.connect();
export const orm = ormObject.instance;
