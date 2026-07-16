export interface User {
  id: string;
  uuid: string;
  admissionNumber: string;
  firstName: string;
  middleName?: string;
  lastName: string;
  email: string;
  phone: string;
  role: string;
  profilePhoto?: string | null;
  status: string;
  isEmailVerified: boolean;
  isPhoneVerified: boolean;
}

export interface AuthResponse {

  success: boolean;

  message: string;

  data: {

    accessToken: string;

    refreshToken: string;

    user: User;

  };

  errors: any[];

}
