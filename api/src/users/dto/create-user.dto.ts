export class CreateUserDto {
  email: string;
  passwordHash: string; // Would be populated by plain password hashing in Auth
  username: string;
  displayName?: string;
}
