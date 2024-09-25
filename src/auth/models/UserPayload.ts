import { Role } from "../role/role.enum";

export interface UserPayload {
    sub: number;
    email: string;
    role: Role;
  }