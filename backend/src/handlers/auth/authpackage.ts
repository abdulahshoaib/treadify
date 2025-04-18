import { login } from "./login.ts"
import { signup, checkUsername } from "./signup.ts"
import { logout } from "./logout.ts"
import { validateCode, generateCode } from "./joincode.ts"
import github from "./github.ts"

export const Auth = {
    checkUsername,
    login,
    signup,
    logout,
    github,
    generateCode,
    validateCode
}
