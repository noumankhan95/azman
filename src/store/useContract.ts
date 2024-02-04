import {
  addDoc,
  arrayUnion,
  collection,
  doc,
  serverTimestamp,
  updateDoc,
} from 'firebase/firestore';
import { ref, uploadBytes } from 'firebase/storage';
import { create } from 'zustand';
//@ts-ignore
import { db, storage } from '../firebase.js';
const useContract = create<ContractStore>((set, get) => ({
  contract: {
    html: '',
    name: '',
    type: '',
    file: [],
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
          return;
        } else if (f.url instanceof File) {
          let name = `contracts/${c.name}/${f.url.name}`;

          try {
            await uploadBytes(ref(storage, name), f.url);
            images.push({ url: name });
            console.log('File Uploaded');
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
        file: arrayUnion(...images),
        createdAt: serverTimestamp(),
      });
    } catch (e) {
      console.log(e);
      throw e;
    }
  },
  resetContract() {
    set((state) => ({
      ...state,
      contract: { html: '', name: '', type: '', file: [] },
    }));
  },
  setcontract({ html, name, type, file }) {
    set((state) => ({
      ...state,
      contract: { html, name, type, file },
    }));
  },
  async updateIndb(c) {
    try {
      const st = get();
      const images: { url: string }[] = [];

      const uploadPromises = c.file?.map(async (f) => {
        console.log(f);
        if (typeof f.url === 'string') {
          return;
        } else if (f.url instanceof File) {
          let name = `contracts/${c.name}/${f.url.name}`;

          try {
            await uploadBytes(ref(storage, name), f.url);
            images.push({ url: name });
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
        file: arrayUnion(...images),
        updatedAt: serverTimestamp(),
      });
    } catch (e) {
      console.log(e);
      throw e;
    }
  },
}));

export default useContract;
