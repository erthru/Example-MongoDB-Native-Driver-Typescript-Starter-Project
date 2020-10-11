import * as dotEnv from "dotenv";

dotEnv.config();

export const PORT = (process.env.PORT as unknown) as number
export const DB_CONF = (process.env.DB_CONF as unknown) as string