
export interface Student {
  id?: string;
  name: string;
  rollNo?: string;
  className: string;
  section: string;
  gender: 'Male' | 'Female';
  dob: string;
  phone: string;
  parentName: string;
  address: string;
  feeStatus: 'Paid' | 'Pending' | 'Overdue';
  attendancePct: number;
  admissionDate: string;
  avatarColor: string;
  bloodGroup: string;
  email: string;
}
