// Opt-in, loopback-only browser fixture server. Never connects to managed data.
import http from "node:http";
import next from "next";
import { configureFixture, fixtureBackend } from "../tests/helpers/private-draft-backend.mjs";
if (process.env.PRIVATE_DRAFT_UI_FIXTURE !== "1") throw Error("Set PRIVATE_DRAFT_UI_FIXTURE=1 explicitly");
configureFixture();
const backend = fixtureBackend();
globalThis.fetch = backend.fetch;
const app = next({ dev: false, hostname: "127.0.0.1", port: 43128 });
await app.prepare();
http.createServer(app.getRequestHandler()).listen(43128,"127.0.0.1",()=>console.log("Synthetic private flow only: http://127.0.0.1:43128/private/provider-draft"));
