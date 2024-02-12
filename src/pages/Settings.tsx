import { Field, ErrorMessage, FormikProvider, useFormik } from 'formik';
import * as yup from 'yup';
import Buttons from './UiElements/Buttons';
//@ts-ignore
import { db } from '../firebase.js';
import {
  addDoc,
  collection,
  doc,
  getDocs,
  updateDoc,
} from 'firebase/firestore';
import { useCallback, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { LoaderIcon } from 'react-hot-toast';

type ContractSettings = {
  cinfo: { from: number; to: number; price: number }[];
  id?: string;
};

const validationSchema = yup.object().shape({
  details: yup.array().of(
    yup.object().shape({
      from: yup.number().required('From is Required'),
      to: yup.number().required('To is Required'),
      price: yup
        .number()
        .min(1, 'Cant be Less than 1')
        .required('Price is Required'),
    }),
  ),
});
const Settings = () => {
  const [isloading, setisloading] = useState<boolean>(false);
  const [AppSettings, setSettings] = useState<ContractSettings>();
  const [reload, setreload] = useState<boolean>(false);
  const [shouldUpdate, setshouldUpdate] = useState<boolean>(false);

  const formikobj = useFormik({
    enableReinitialize: true,
    initialValues: {
      details: AppSettings?.cinfo || [
        {
          from: 0,
          to: 0,
          price: 0,
        },
      ],
    },
    validationSchema,
    async onSubmit(values, formikHelpers) {
      try {
        setisloading(true);
        console.log('Submit');
        if (shouldUpdate) {
          await updateDoc(doc(db, 'settings', AppSettings?.id!), {
            settings: values.details,
          });
        } else {
          addDoc(collection(db, 'settings'), {
            settings: values.details,
          });
        }
        toast.success('Success');
      } catch (e) {
        toast.error('An Error Occured');
      } finally {
        setisloading(false);
      }
    },
  });
  useEffect(() => {
    getSettings();
  }, []);
  const getSettings = useCallback(async () => {
    try {
      setisloading(true);
      const cats = await getDocs(collection(db, 'settings'));
      const catarray: ContractSettings['cinfo'] = [];
      if (!cats.empty) {
        catarray.push(
          ...(cats.docs[0].data()?.settings as ContractSettings['cinfo']),
        );
      }
      setshouldUpdate(catarray.length > 0);
      setSettings({ cinfo: catarray, id: cats.docs[0].id });
    } catch (e) {
      toast.error(
        'Couldnt Fetch Settings , Either They Dont Exist or Your Internet Connection isnt Working',
      );
    } finally {
      setisloading(false);
      setreload(false);
    }
  }, []);
  console.log('result', AppSettings);

  return (
    <FormikProvider value={formikobj}>
      <form onSubmit={formikobj.handleSubmit}>
        {formikobj.values.details.map((d, index) => (
          <div
            className="w-full flex flex-col lg:flex-row lg:space-x-5 my-3 "
            key={index}
          >
            <div className="w-full md:w-2/5 ">
              <label className="mb-3 block text-black dark:text-white">
                From
              </label>
              <Field
                type="number"
                name={`details.${index}.from`}
                placeholder="From"
                className="w-full  bg-white rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
              />
              <ErrorMessage
                name={`details.${index}.from`}
                component="div"
                className="text-danger"
              />
            </div>
            <div className="w-full md:w-2/5">
              <label className="mb-3 block text-black dark:text-white">
                To
              </label>
              <Field
                type="number"
                name={`details.${index}.to`}
                placeholder="To"
                className="w-full  bg-white rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
              />
              <ErrorMessage
                name={`details.${index}.to`}
                component="div"
                className="text-danger"
              />
            </div>

            <div className="w-full md:w-2/5">
              <label className="mb-3 block text-black dark:text-white">
                Price
              </label>
              <Field
                type="number"
                name={`details.${index}.price`}
                placeholder="Price"
                className="w-full  bg-white rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
              />
              <ErrorMessage
                name={`details.${index}.price`}
                component="div"
                className="text-danger"
              />
            </div>
            <div className="w-20 flex items-end pb-2">
              {index > 0 && (
                <svg
                  fill="#ff0000"
                  height={20}
                  width={20}
                  viewBox="0 0 32 32"
                  version="1.1"
                  xmlns="http://www.w3.org/2000/svg"
                  stroke="#ff0000"
                  className="cursor-pointer"
                  onClick={() => {
                    formikobj.setFieldValue('details', [
                      ...formikobj.values.details.slice(0, -1),
                    ]);
                  }}
                >
                  <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                  <g
                    id="SVGRepo_tracerCarrier"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  ></g>
                  <g id="SVGRepo_iconCarrier">
                    {' '}
                    <title>cancel</title>{' '}
                    <path d="M10.771 8.518c-1.144 0.215-2.83 2.171-2.086 2.915l4.573 4.571-4.573 4.571c-0.915 0.915 1.829 3.656 2.744 2.742l4.573-4.571 4.573 4.571c0.915 0.915 3.658-1.829 2.744-2.742l-4.573-4.571 4.573-4.571c0.915-0.915-1.829-3.656-2.744-2.742l-4.573 4.571-4.573-4.571c-0.173-0.171-0.394-0.223-0.657-0.173v0zM16 1c-8.285 0-15 6.716-15 15s6.715 15 15 15 15-6.716 15-15-6.715-15-15-15zM16 4.75c6.213 0 11.25 5.037 11.25 11.25s-5.037 11.25-11.25 11.25-11.25-5.037-11.25-11.25c0.001-6.213 5.037-11.25 11.25-11.25z"></path>{' '}
                  </g>
                </svg>
              )}
            </div>
          </div>
        ))}
        <div className="w-full relative -ml-5 my-8">
          <svg
            viewBox="0 0 1024 1024"
            height={30}
            width={30}
            version="1.1"
            className="icon absolute right-0 cursor-pointer"
            xmlns="http://www.w3.org/2000/svg"
            fill="#000000"
            onClick={() => {
              formikobj.setFieldValue('details', [
                ...formikobj.values.details,
                { from: '', to: '', price: 0 },
              ]);
            }}
          >
            <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
            <g
              id="SVGRepo_tracerCarrier"
              stroke-linecap="round"
              stroke-linejoin="round"
            ></g>
            <g id="SVGRepo_iconCarrier">
              <path
                d="M512 1024C229.7 1024 0 794.3 0 512S229.7 0 512 0s512 229.7 512 512-229.7 512-512 512z m0-938.7C276.7 85.3 85.3 276.7 85.3 512S276.7 938.7 512 938.7 938.7 747.3 938.7 512 747.3 85.3 512 85.3z"
                fill="#00ff2a"
              ></path>
              <path
                d="M682.7 554.7H341.3c-23.6 0-42.7-19.1-42.7-42.7s19.1-42.7 42.7-42.7h341.3c23.6 0 42.7 19.1 42.7 42.7s-19.1 42.7-42.6 42.7z"
                fill="#00ff1e"
              ></path>
              <path
                d="M512 725.3c-23.6 0-42.7-19.1-42.7-42.7V341.3c0-23.6 19.1-42.7 42.7-42.7s42.7 19.1 42.7 42.7v341.3c0 23.6-19.1 42.7-42.7 42.7z"
                fill="#00ff1e"
              ></path>
            </g>
          </svg>
        </div>
        <button
          type="submit"
          disabled={!!isloading}
          className="inline-flex my-20 items-center justify-center rounded-md bg-primary py-4 px-10 text-center font-medium text-white hover:bg-opacity-90 lg:px-8 xl:px-10"
        >
          {isloading ? (
            <LoaderIcon style={{ height: 30, width: 30, margin: 'auto' }} />
          ) : shouldUpdate ? (
            'Update'
          ) : (
            'Save'
          )}
        </button>
      </form>
    </FormikProvider>
  );
};

export default Settings;
