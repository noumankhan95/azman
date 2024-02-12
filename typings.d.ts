type WebsiteUsers = {
  uid: string;
  role?: string[];
  email: string;
  name: string;
  phoneNo: string;
  cnic: string;
  date: string;
  aldolat: string;
  almadina: string;
  almontaqatha: string;
  capacity?: string;
  approval: string;
  status: string;
  wakeelAttachedFile1?: string;
  wakeelAttachedFile2?: string;
  wakeelCNIC?: string;
  wakeelDate?: string;
  wakeelDescription?: string;
  wakeelName?: string;
  wakeelPNO?: string;
};

interface UserAuth extends WebsiteUsers {
  isloggedIn: boolean;
  setisloggedIn: (user: { isloggedIn: boolean } & WebsiteUsers) => void;
  setuser: (user: { isloggedIn?: boolean } & WebsiteUsers) => void;
}

type Approval = 'Pending' | 'Approved' | 'Disapproved';

type Status = 'Blocked' | 'Unblocked';

type Contract = {
  id?: string;
  name: string;
  type: string;
  file: Array<{ url: string | File }>;
  html: string;
  rentaldetails?: Array<{ from: string; to: string; price: number }>;
  installmentdetails?: Array<{
    from: string;
    to: string;
    ninstallments: number;
    downpayment: number;
    price: number;
  }>;
  sellingdetails?: { price: number };
  questions: Array<{ question: string; answer: string }>;
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
