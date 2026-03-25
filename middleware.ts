export { auth as middleware } from "@/lib/auth/edge.config"

export const config = {
  matcher: [
    "/profile/:path*",
    "/quiz/:path*/save",
    "/recommendations/:path*/save",
    "/api/users/:path*",
  ],
}
