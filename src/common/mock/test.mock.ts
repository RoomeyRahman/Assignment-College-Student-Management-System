import { StudentDto, CreateStudentDto } from '../../students/dto';
import { UserDto, CreateUserDto } from '../../users/dto';

export const mockUser = {
  _id: '663a8659ed8d34691a32a261',
  email: 'test@mail.com',
  password: '12345',
  isActive: true,
  isDeleted: false,
  isSuperAdmin: false,
};

export const mockUserDto = new UserDto();
mockUser.email = 'test@mail.com';
mockUser.password = '12345';
mockUser.isActive = true;
mockUser.isDeleted = false;
mockUser.isSuperAdmin = false;

export const mockCreateUserDto = new CreateUserDto({
  email: mockUser.email,
  password: mockUser.password,
});

export const mockStudent = {
  isActive: true,
  isDeleted: false,
  cTime: 1715169003824,
  cBy: '663a8659ed8d34691a32a261',
  studentId: '4',
  name: 'Ataur Rahman',
  age: 24,
  gender: 'Male',
  course: 'CSE',
  hobby: 'gardening',
  admissionDate: 1389526564,
  _id: '663b66ebf6edf59ac6422637',
};

export const mockCreateStudentDto = new CreateStudentDto({
  studentId: '4',
  name: 'Ataur Rahman',
  age: 24,
  gender: 'Male',
  course: 'CSE',
  hobby: 'gardening',
  admissionDate: 1389526564,
});

export const mockStudents = [
  { ...mockStudent },
  {
    ...mockStudent,
    _id: '663b66ebf6edf59ac6422638',
  },
];

export const mockQuery = {
  pagination: true,
  limit: 10,
  skip: 0,
  sort: '{"name": "asc"}',
};
