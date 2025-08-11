"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RegisterClient = void 0;
class RegisterClient {
    userRepository;
    constructor(userRepository) {
        this.userRepository = userRepository;
    }
    async execute(input) {
        const existingUser = await this.userRepository.findByEmail(input.email);
        if (existingUser) {
            throw new Error('Email already in use');
        }
        const newUser = {
            id: 'some-random-id',
            name: input.name,
            email: input.email,
            passwordHash: input.password,
            role: 'client',
        };
        await this.userRepository.save(newUser);
    }
}
exports.RegisterClient = RegisterClient;
//# sourceMappingURL=RegisterClient.js.map