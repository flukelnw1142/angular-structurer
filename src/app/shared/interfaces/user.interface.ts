


export interface IUser {
  jwttoken: string
  username: string
  role: any
  employeeId: number
  firstName: string
  lastName: string
  email: string
  prefix: string
  phoneNumber: string
  employeeCode: string
  createDate: any
  roleCode: string[]
  position: string
}

export interface RegisterUserReq {
  username: string;
  password: string;
  confirmPassword: string;
  pin: string;
  createDate: string;
  roleCode: string;
  employeeId: number;
  employeeCode: string;
  firstName: string;
  lastName: string;
  prefix: string;
  email: string;
  phoneNumber: string;
  position: string;
}
