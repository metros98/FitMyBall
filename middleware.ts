export { auth as middleware } from "@/lib/auth/auth.config"

export const config = {
  matcher: [
    "/profile/:path*",
    "/quiz/:path*/save",
    "/recommendations/:path*/save",
    "/api/users/:path*",
  ],
}
