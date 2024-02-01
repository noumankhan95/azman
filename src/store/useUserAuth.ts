import { create } from 'zustand';

const useUserAuth = create<UserAuth>((set) => ({
  uid: '',
  phone: '',
  isloggedIn: false,
  email: '',
  cnic: '',
  phoneNo: '',
  name: '',
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
}));

export default useUserAuth;
