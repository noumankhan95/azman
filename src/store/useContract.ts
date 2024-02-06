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
    details: [{ from: '', price: 0, to: '' }],
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
        details: c.details,
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
      contract: {
        html: '',
        name: '',
        type: '',
        file: [],
        details: [{ from: '', price: 0, to: '' }],
      },
    }));
  },
  setcontract({ html, name, type, file, details }) {
    set((state) => ({
      ...state,
      contract: { html, name, type, file, details },
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
        details: c.details,

        updatedAt: serverTimestamp(),
      });
    } catch (e) {
      console.log(e);
      throw e;
    }
  },
}));

export default useContract;
