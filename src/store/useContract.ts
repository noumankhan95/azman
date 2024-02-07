import {
  addDoc,
  arrayUnion,
  collection,
  doc,
  serverTimestamp,
  updateDoc,
} from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { create } from 'zustand';
//@ts-ignore
import { db, storage } from '../firebase.js';
const useContract = create<ContractStore>((set, get) => ({
  contract: {
    html: '',
    name: '',
    type: '',
    file: [],
    installmentdetails: [
      { downpayment: 0, from: '', ninstallments: 0, to: '', price: 0 },
    ],
    rentaldetails: [{ from: '', price: 0, to: '' }],
    sellingdetails: { price: 0 },
    questions: [{ answer: '', question: '' }],
  },
  isEditing: { id: '', value: false },
  setisEditing: (id: string) => {
    set((state) => ({ ...state, isEditing: { id, value: true } }));
  },
  setisNotEditing: () => {
    set((state) => ({ ...state, isEditing: { id: '', value: false } }));
  },
  async addToDb(c) {
    try {
      const images: { url: string }[] = [];

      const uploadPromises = c.file?.map(async (f) => {
        console.log(f);
        if (typeof f.url === 'string') {
          images.push({ url: f.url });
          return;
        } else if (f.url instanceof File) {
          let name = `contracts/${c.name}/${f.url.name}`;

          try {
            const r = await uploadBytes(ref(storage, name), f.url);
            const constructedURL = await getDownloadURL(ref(storage, name));
            images.push({ url: constructedURL });
            // const constructedURL = `https://storage.googleapis.com/${storage.bucket}/${r.metadata.fullPath}`;
            console.log('File Uploaded', r.metadata.ref?.toString());

            console.log('File Uploaded', r.ref);
          } catch (e) {
            // alert(e);
            throw e;
          }
        }
      });

      // Wait for all file uploads to complete
      await Promise.all(uploadPromises!);
      await addDoc(collection(db, 'contracts'), {
        type: c.type,
        name: c.name,
        html: c.html,
        file: images,
        installmentdetails: c.installmentdetails,
        sellingdetails: c.sellingdetails,
        rentaldetails: c.rentaldetails,
        createdAt: serverTimestamp(),
        questions: c.questions,
      });
    } catch (e) {
      console.log(e);
      throw e;
    }
  },
  resetContract() {
    set((state) => ({
      ...state,
      contract: {
        html: '',
        name: '',
        type: '',
        file: [],
        installmentdetails: [
          { downpayment: 0, from: '', ninstallments: 0, to: '', price: 0 },
        ],
        rentaldetails: [{ from: '', price: 0, to: '' }],
        sellingdetails: { price: 0 },
        questions: [{ answer: '', question: '' }],
      },
    }));
  },
  setcontract({
    html,
    name,
    type,
    file,
    installmentdetails,
    rentaldetails,
    sellingdetails,
    questions,
  }) {
    set((state) => ({
      ...state,
      contract: {
        html,
        name,
        type,
        file,
        installmentdetails,
        rentaldetails,
        sellingdetails,
        questions,
      },
    }));
  },
  async updateIndb(c) {
    try {
      const st = get();
      const images: { url: string }[] = [];

      const uploadPromises = c.file?.map(async (f) => {
        console.log(f);
        if (typeof f.url === 'string') {
          images.push({ url: f.url });
          return;
        } else if (f.url instanceof File) {
          let name = `contracts/${c.name}/${f.url.name}`;

          try {
            const r = await uploadBytes(ref(storage, name), f.url);
            const constructedURL = await getDownloadURL(ref(storage, name));
            images.push({ url: constructedURL });
            console.log('File Uploaded');
          } catch (e) {
            // alert(e);
            throw e;
          }
        }
      });
      if (!st.isEditing.id) throw 'No Id Exists';
      // Wait for all file uploads to complete
      await Promise.all(uploadPromises!);
      await updateDoc(doc(db, 'contracts', st.isEditing.id), {
        type: c.type,
        name: c.name,
        html: c.html,
        file: images,
        installmentdetails: c.installmentdetails,
        sellingdetails: c.sellingdetails,
        rentaldetails: c.rentaldetails,
        questions: c.questions,
        updatedAt: serverTimestamp(),
      });
    } catch (e) {
      console.log(e);
      throw e;
    }
  },
}));

export default useContract;
