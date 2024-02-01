type WebsiteUsers = {
  uid: string;
  role?: Roles;
  email: string;
  name: string;
  phoneNo: string;
  cnic: string;
};

interface UserAuth extends WebsiteUsers {
  isloggedIn: boolean;
  setisloggedIn: (user: { isloggedIn: boolean } & WebsiteUsers) => void;
}
type Roles = 'Staff' | 'Admin' | 'User';
