import { IUserRepository } from "./ports/IUserRepository";
export interface RegisterClientInput {
    name: string;
    email: string;
    password: string;
}
export declare class RegisterClient {
    private readonly userRepository;
    constructor(userRepository: IUserRepository);
    execute(input: RegisterClientInput): Promise<void>;
}
