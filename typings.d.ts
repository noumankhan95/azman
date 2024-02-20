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
interface UserContract {
  baseContractID: string;
  baseContractStartDate: string;
  baseContractTitle: string;
  baseContractType: string;
  contractHTML: string;
  contractId: string;
  contracteeCnic: string;
  contracteeDate: string;
  contracteeEmail: string;
  contracteeMembershipID: string;
  contracteeName: string;
  contracteePhoneNo: string;
  contracteeUid: string;
  contractorAmount: number;
  contractorCnic: string;
  contractorDate: string;
  contractorDuration: number;
  contractorEmail: string;
  contractorName: string;
  contractorPhoneNo: string;
  contractorUid: string;
  questions: Question[];
  id?: string;
  installments: Installment[];
}
interface Installment {
  amount: number;
  date: number;
  description: string;
  operationtype: string;
  remainingAmount: number;
  status: string;
}

interface Question {
  answer: string;
  question: string;
}
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

type UserContractStore = {
  contract: UserContract;
  setcontract: (c: UserContract) => void;
  resetContract: () => void;
};
