import { UserDto, CreateUserDto } from '../../users/dto';

export const mockUser = new UserDto();
mockUser.email = 'test@mail.com';
mockUser.password = '12345';
mockUser.isActive = true;
mockUser.isDeleted = false;
mockUser.isSuperAdmin = false;

export const mockCreateUserDto = new CreateUserDto({
    email: mockUser.email,
    password: mockUser.password
});