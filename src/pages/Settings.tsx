import { Field, ErrorMessage, FormikProvider, useFormik } from 'formik';
import * as yup from 'yup';
import Buttons from './UiElements/Buttons';
//@ts-ignore
import { db, storage } from '../firebase.js';
import {
  addDoc,
  collection,
  doc,
  getDocs,
  updateDoc,
} from 'firebase/firestore';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { toast } from 'react-toastify';
import { LoaderIcon } from 'react-hot-toast';
import DynamicFirebaseImageComponent from '../components/DynamicFirebaseImageComponent.js';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { useTranslation } from 'react-i18next';
type images = {
  url: File | string;
};
type ContractSettings = {
  cinfo: { from: number; to: number; price: number }[];
  id?: string;
  appPrice: number;
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
  AppPrice: yup.number().required('From is Required'),
});
const Settings = () => {
  const [isloading, setisloading] = useState<boolean>(false);
  const [AppSettings, setSettings] = useState<ContractSettings>();
  const [reload, setreload] = useState<boolean>(false);
  const [shouldUpdate, setshouldUpdate] = useState<boolean>(false);
  const [images, setimages] = useState<images[]>([]);
  const { t, i18n } = useTranslation();
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
      AppPrice: AppSettings?.appPrice || '',
    },
    validationSchema,
    async onSubmit(values, formikHelpers) {
      try {
        setisloading(true);
        const imgs: { url: string | File }[] = [];
        const uploadPromises = images?.map(async (f) => {
          console.log(f);
          if (typeof f.url === 'string') {
            imgs.push({ url: f.url });
            return;
          } else if (f.url instanceof File) {
            let name = `settings/${f.url.name}`;

            try {
              const r = await uploadBytes(ref(storage, name), f.url);
              const constructedURL = await getDownloadURL(ref(storage, name));
              imgs.push({ url: constructedURL });
            } catch (e) {
              console.log(e);
              throw e;
            }
          }
        });
        await Promise.all(uploadPromises!);
        console.log(imgs);
        if (shouldUpdate) {
          await updateDoc(doc(db, 'settings', AppSettings?.id!), {
            settings: values.details,
            files: imgs,
            appPrice: values.AppPrice,
          });
        } else {
          addDoc(collection(db, 'settings'), {
            settings: values.details,
            files: imgs,
            appPrice: values.AppPrice,
          });
        }
        toast.success('Success');
      } catch (e) {
        console.log(e);

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
      setSettings({
        cinfo: catarray,
        id: cats.docs[0].id,
        appPrice: cats.docs[0].data()?.appPrice,
      });
      setimages(cats.docs[0].data()?.files as images[]);
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

  const removeImageFromImages = useCallback((img: string | File) => {
    if (typeof img == 'string') {
      setimages((p) =>
        p.filter((image) => {
          return typeof image.url == 'string' ? image.url !== img : true;
        }),
      );
    } else if (img instanceof File) {
      setimages((p) =>
        p.filter((image) => {
          return image.url instanceof File ? image.url.name !== img.name : true;
        }),
      );
    }
  }, []);
  const MemoizedImages = useMemo(() => {
    return (
      <div className="flex flex-row flex-wrap justify-center items-center py-3">
        {images &&
          images?.map(
            (i, ind) =>
              i.url !== '' && (
                <div className="w-80 my-3 mx-3 md:my-0 relative " key={ind}>
                  {i.url instanceof File ? (
                    <>
                      <svg
                        fill="#ff0000"
                        width="18px"
                        height="18px"
                        viewBox="0 0 32 32"
                        version="1.1"
                        xmlns="http://www.w3.org/2000/svg"
                        stroke="#ff0000"
                        className="cursor-pointer"
                        onClick={() => {
                          removeImageFromImages(i.url);
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
                      {i.url.name.includes('mp4') ||
                      i.url.name.includes('mp3') ? (
                        <video width="320" height="240" controls>
                          <source
                            src={`${URL.createObjectURL(i.url)}`}
                            type="video/mp4"
                          />
                          Your browser does not support the video tag.
                        </video>
                      ) : (
                        <img
                          src={`${URL.createObjectURL(i.url)}`}
                          className="max-w-full object-contain"
                        />
                      )}
                    </>
                  ) : (
                    <DynamicFirebaseImageComponent
                      storagePath={i.url}
                      removeImage={removeImageFromImages}
                    />
                  )}
                </div>
              ),
          )}
      </div>
    );
  }, [images]);
  return (
    <FormikProvider value={formikobj}>
      <form onSubmit={formikobj.handleSubmit}>
        {formikobj.values.details.map((d, index) => (
          <div
            className="w-full flex flex-col lg:flex-row lg:space-x-5 my-3 gap-10"
            key={index}
            style={{ direction: i18n.language == 'ar' ? 'rtl' : 'ltr' }}
          >
            <div className="w-full md:w-2/5 ">
              <label className={`mb-3 block text-black dark:text-white `}>
                {t('From')}
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
              <label className={`mb-3 block text-black dark:text-white `}>
                {t('To')}
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
              <label className={`mb-3 block text-black dark:text-white `}>
                {t('Price')}
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
        <div
          className="w-full relative -ml-5 my-8"
          style={{
            direction: i18n.language == 'ar' ? 'rtl' : 'ltr',
            marginTop: i18n.language == 'ar' ? '8px' : '0px',
          }}
        >
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
        <div
          className="w-full"
          style={{
            direction: i18n.language == 'ar' ? 'rtl' : 'ltr',
            marginTop: i18n.language == 'ar' ? '4rem' : '0rem',
          }}
        >
          <div className="md:w-2/5 ">
            <label className={`mb-3 block text-black dark:text-white `}>
              {t('App Price')}
            </label>
            <Field
              type="number"
              name={`AppPrice`}
              placeholder="App Price"
              className="w-full  bg-white rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
            />
            <ErrorMessage
              name={`AppPrice`}
              component="div"
              className="text-danger"
            />
          </div>
        </div>
        <div className="overflow-hidden rounded-sm border border-strokeshadow-default dark:border-strokedark my-5 dark:bg-boxdark">
          <div className="px-4 py-5 pb-6 text-center lg:pb-8 xl:pb-11.5">
            <h1>{t('Choose Image')}</h1>
            <div className="relative z-30 mx-auto  h-30 w-full max-w-30 rounded-full p-1 backdrop-blur sm:h-44 sm:max-w-44 sm:p-3">
              <div className="relative drop-shadow-2">
                <svg
                  viewBox="0 0 1024 1024"
                  className="icon"
                  version="1.1"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="#000000"
                >
                  <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                  <g
                    id="SVGRepo_tracerCarrier"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  ></g>
                  <g id="SVGRepo_iconCarrier">
                    <path
                      d="M853.333333 960H170.666667V64h469.333333l213.333333 213.333333z"
                      fill="#90CAF9"
                    ></path>
                    <path
                      d="M821.333333 298.666667H618.666667V96z"
                      fill="#E1F5FE"
                    ></path>
                    <path
                      d="M448 490.666667l-149.333333 213.333333h298.666666z"
                      fill="#1565C0"
                    ></path>
                    <path
                      d="M597.333333 563.2L490.666667 704h213.333333z"
                      fill="#1976D2"
                    ></path>
                    <path
                      d="M672 522.666667m-32 0a32 32 0 1 0 64 0 32 32 0 1 0-64 0Z"
                      fill="#1976D2"
                    ></path>
                  </g>
                </svg>
                <label
                  htmlFor="file"
                  className="absolute bottom-0 right-0 flex h-8.5 w-8.5 cursor-pointer items-center justify-center rounded-full bg-primary text-white hover:bg-opacity-90 sm:bottom-2 sm:right-2"
                >
                  <svg
                    className="fill-current"
                    width="14"
                    height="14"
                    viewBox="0 0 14 14"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M4.76464 1.42638C4.87283 1.2641 5.05496 1.16663 5.25 1.16663H8.75C8.94504 1.16663 9.12717 1.2641 9.23536 1.42638L10.2289 2.91663H12.25C12.7141 2.91663 13.1592 3.101 13.4874 3.42919C13.8156 3.75738 14 4.2025 14 4.66663V11.0833C14 11.5474 13.8156 11.9925 13.4874 12.3207C13.1592 12.6489 12.7141 12.8333 12.25 12.8333H1.75C1.28587 12.8333 0.840752 12.6489 0.512563 12.3207C0.184375 11.9925 0 11.5474 0 11.0833V4.66663C0 4.2025 0.184374 3.75738 0.512563 3.42919C0.840752 3.101 1.28587 2.91663 1.75 2.91663H3.77114L4.76464 1.42638ZM5.56219 2.33329L4.5687 3.82353C4.46051 3.98582 4.27837 4.08329 4.08333 4.08329H1.75C1.59529 4.08329 1.44692 4.14475 1.33752 4.25415C1.22812 4.36354 1.16667 4.51192 1.16667 4.66663V11.0833C1.16667 11.238 1.22812 11.3864 1.33752 11.4958C1.44692 11.6052 1.59529 11.6666 1.75 11.6666H12.25C12.4047 11.6666 12.5531 11.6052 12.6625 11.4958C12.7719 11.3864 12.8333 11.238 12.8333 11.0833V4.66663C12.8333 4.51192 12.7719 4.36354 12.6625 4.25415C12.5531 4.14475 12.4047 4.08329 12.25 4.08329H9.91667C9.72163 4.08329 9.53949 3.98582 9.4313 3.82353L8.43781 2.33329H5.56219Z"
                      fill=""
                    />
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M7.00004 5.83329C6.03354 5.83329 5.25004 6.61679 5.25004 7.58329C5.25004 8.54979 6.03354 9.33329 7.00004 9.33329C7.96654 9.33329 8.75004 8.54979 8.75004 7.58329C8.75004 6.61679 7.96654 5.83329 7.00004 5.83329ZM4.08337 7.58329C4.08337 5.97246 5.38921 4.66663 7.00004 4.66663C8.61087 4.66663 9.91671 5.97246 9.91671 7.58329C9.91671 9.19412 8.61087 10.5 7.00004 10.5C5.38921 10.5 4.08337 9.19412 4.08337 7.58329Z"
                      fill=""
                    />
                  </svg>
                  <input
                    type="file"
                    name="file"
                    id="file"
                    value=""
                    className="sr-only"
                    onChange={(e: any) => {
                      setimages((p) => [...p, { url: e.target.files?.[0]! }]);
                    }}
                  />
                </label>
              </div>
            </div>
          </div>
          <>{MemoizedImages}</>
        </div>
        <div style={{ direction: i18n.language == 'ar' ? 'rtl' : 'ltr' }}>
          <button
            type="submit"
            disabled={!!isloading}
            className="inline-flex my-20 items-center justify-center rounded-md bg-primary py-4 px-10 text-center font-medium text-white hover:bg-opacity-90 lg:px-8 xl:px-10"
          >
            {isloading ? (
              <LoaderIcon style={{ height: 30, width: 30, margin: 'auto' }} />
            ) : shouldUpdate ? (
              t('Update')
            ) : (
              t('Save')
            )}
          </button>
        </div>
      </form>
    </FormikProvider>
  );
};

export default Settings;
