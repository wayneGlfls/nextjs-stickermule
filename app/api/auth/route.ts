import { handlers } from "@/auth"
export const { GET, POST } = handlers


// ensure Vercel doesn't cache the result of this route,
// as otherwise the token request data will eventually become outdated
// and we won't be able to authenticate on the client side