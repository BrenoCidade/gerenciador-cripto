import { Role } from "../role/role.enum";

export interface UserFromJwt {
    id: number;
    email: string;
    role: Role;
  }