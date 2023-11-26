export class CreateUserDto {
  readonly name!: string;
  readonly username!: string;
  readonly login!: string;
  readonly email!: string;
  readonly password?: string;
  readonly image!: string;
}
