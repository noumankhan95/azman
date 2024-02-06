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

type Contract = {
  id?: string;
  name: string;
  type: string;
  file: Array<{ url: string | File }>;
  html: string;
  details: Array<{ from: string; to: string; price: number }>;
};

type ContractStore = {
  contract: Contract;
  setcontract: (c: Contract) => void;
  addToDb: (c: Contract) => Promise<void>;
  updateIndb: (c: Contract) => Promise<void>;
  resetContract: () => void;
  isEditing: { value: boolean; id: string };
  setisEditing: (id: string) => void;
  setisNotEditing: () => void;
};
