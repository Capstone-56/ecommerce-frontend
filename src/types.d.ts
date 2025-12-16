interface Me {
  id: string;
  username: string;
  firstname: string;
  lastname: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  hasPfp: boolean;
  gender: "male" | "female" | "";
  role: "admin" | "customer";
}

interface DateItemType {
  name: string;
  date: number;
  month: number;
}