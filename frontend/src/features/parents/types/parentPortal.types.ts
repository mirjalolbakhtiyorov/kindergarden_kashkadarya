export interface ParentPortalUser {
  id: string;
  childName: string;
  childBirthCertificate: string;
  fatherName: string;
  fatherPhone: string;
  fatherPassport?: string;
  motherName: string;
  motherPhone: string;
  motherPassport?: string;
  childGroup: string;
  login: string;
  password?: string;
}
