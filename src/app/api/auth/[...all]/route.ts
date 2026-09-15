import { handleAuth } from "@/lib/auth-handler";

export const runtime = "nodejs";
export const maxDuration = 300;
export const GET = handleAuth;
export const POST = handleAuth;