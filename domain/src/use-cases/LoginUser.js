"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoginUser = void 0;
class LoginUser {
    userRepository;
    constructor(userRepository) {
        this.userRepository = userRepository;
    }
    async execute(input) {
        const user = await this.userRepository.findByEmail(input.email);
        if (!user) {
            throw new Error('Invalid credentials');
        }
        if (input.password !== user.passwordHash) {
            throw new Error('Invalid credentials');
        }
        const { passwordHash, ...userWithoutPassword } = user;
        return userWithoutPassword;
    }
}
exports.LoginUser = LoginUser;
//# sourceMappingURL=LoginUser.js.map