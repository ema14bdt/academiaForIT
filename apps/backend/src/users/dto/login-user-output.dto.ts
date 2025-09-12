import { Role } from '@domain/entities/User';

export class LoginUserOutputDto {
  id: string;
  name: string;
  email: string;
  role: Role;
}
