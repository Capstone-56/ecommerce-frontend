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

type UserDateTitleType = "birthday" | "anniversary" | "other";

interface DateItemType {
  id: string;
  name: UserDateTitleType;
  remarks: string;
  date: number;
  month: number;
}