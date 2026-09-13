import { updateSession } from "@/utils/supabase/middleware";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  return updateSession(request);
}

export const config = {
  matcher: ["/dashboard/:path*"],
};