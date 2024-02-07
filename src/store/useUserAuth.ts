import { create } from 'zustand';

const useUserAuth = create<UserAuth>((set) => ({
  uid: '',
  phone: '',
  isloggedIn: false,
  email: '',
  cnic: '',
  phoneNo: '',
  name: '',
  aldolat: '',
  almadina: '',
  almontaqatha: '',
  approval: '',
  date: '',
  status: '',
  role: [],
  setisloggedIn({ email, name, phoneNo, role, uid, isloggedIn }) {
    set((state) => ({
      ...state,
      email,
      name,
      phoneNo,
      role,
      isloggedIn,
      uid,
    }));
  },
  setuser({
    email,
    name,
    phoneNo,
    role,
    uid,
    aldolat,
    almadina,
    almontaqatha,
    approval,
    cnic,
    date,
    status,
  }) {
    set((state) => ({
      ...state,
      email,
      name,
      phoneNo,
      uid,
      aldolat,
      almadina,
      almontaqatha,
      approval,
      cnic,
      date,
      status,
    }));
  },
}));

export default useUserAuth;
