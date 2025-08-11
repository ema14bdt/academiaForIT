import { User } from "@domain/entities/User";
import { IUserRepository } from "./ports/IUserRepository";
export interface LoginUserInput {
    email: string;
    password: string;
}
export type LoginUserOutput = Omit<User, 'passwordHash'>;
export declare class LoginUser {
    private readonly userRepository;
    constructor(userRepository: IUserRepository);
    execute(input: LoginUserInput): Promise<LoginUserOutput>;
}
