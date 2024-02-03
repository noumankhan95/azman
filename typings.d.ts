type WebsiteUsers = {
  uid: string;
  role?: Roles;
  email: string;
  name: string;
  phoneNo: string;
  cnic: string;
  date: string;
  aldolat: string;
  almadina: string;
  almontaqatha: string;
  approval: string;
  status: string;
};

interface UserAuth extends WebsiteUsers {
  isloggedIn: boolean;
  setisloggedIn: (user: { isloggedIn: boolean } & WebsiteUsers) => void;
}
type Roles = 'Staff' | 'Admin' | 'User';

type Approval = 'Pending' | 'Approved' | 'Disapproved';

type Status = 'Blocked' | 'Unblocked';
