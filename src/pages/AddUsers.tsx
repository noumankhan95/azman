//@ts-ignore
import { db, auth } from '../firebase';
import * as Yup from 'yup';
import { useFormik, FormikProvider, Field, ErrorMessage } from 'formik';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { toast } from 'react-toastify';
import { useState } from 'react';
import Loader from '../common/Loader';
import { LoaderIcon } from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
type images = {
  url: File | string;
};
const validationSchema = Yup.object().shape({
  // Name: Yup.string().required('Name is required'),
  // ArabicName: Yup.string().required('Arabic Name is required'),
  // phone: Yup.number()
  //   .typeError('Phone must be a number')
  //   .required('Phone Number is required'),

  email: Yup.string().required('Email is Required'),

  password: Yup.string().required('Password is Required'),
  roles: Yup.array().of(
    Yup.string().required('Atleast One Permission is Required'),
  ),
});

function AddUsers() {
  const [loading, setisloading] = useState<boolean>(false);
  const { t, i18n } = useTranslation();
  const formikObj = useFormik({
    validationSchema,
    initialValues: {
      // Name: '',
      // ArabicName: '',
      // phone: '',
      email: '',
      password: '',
      roles: [] as string[],
    },
    onSubmit: async (values, formikHelpers) => {
      try {
        setisloading(true);
        console.log(values);

        const u = await createUserWithEmailAndPassword(
          auth,
          values.email,
          values.password,
        );
        await setDoc(doc(db, 'admin_user', u.user.uid), {
          email: values.email,
          role: values.roles,
        });
        toast.success('Successfully Signed Up, Logging In as New User...');
        formikHelpers.resetForm();
      } catch (e) {
        toast.error('Couldnt Create User ' + e);
      } finally {
        setisloading(false);
      }
    },
  });

  return (
    <FormikProvider value={formikObj}>
      <h1
        className="text-2xl my-5"
        style={{ direction: i18n.language == 'ar' ? 'rtl' : 'ltr' }}
      >
        {t('User Information')}
      </h1>

      <form onSubmit={formikObj.handleSubmit}>
        {/* <div className="flex flex-col px-6.5 ">

          <div className="flex flex-col items-start space-y-4  justify-around">
            <div className="w-full md:w-2/5">
              <label className={`mb-3 block text-black dark:text-white ${i18n.language=="ar" && "text-end"}`}>
                Name
              </label>
              <Field
                type="text"
                        style={{ direction: i18n.language == 'ar' ? 'rtl' : 'ltr' }}
                name="Name"
                placeholder="Name"
                className="w-full bg-white rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
              />
              <ErrorMessage
                name="Name"
                component="h1"
                className="text-danger"
              />
            </div>
            <div className="w-full md:w-2/5">
              <label className={`mb-3 block text-black dark:text-white ${i18n.language=="ar" && "text-end"}`}>
                الاسم
              </label>
              <Field
                type="text"
                        style={{ direction: i18n.language == 'ar' ? 'rtl' : 'ltr' }}
                name="ArabicName"
                placeholder="ArabicName"
                className="w-full rounded-lg bg-white border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
              />
              <ErrorMessage
                name="ArabicName"
                component="div"
                className="text-danger"
              />
            </div>
          </div>
        </div> */}

        <div
          className="flex flex-col gap-5.5 p-6.5"
          style={{ direction: i18n.language == 'ar' ? 'rtl' : 'ltr' }}
        >
          {/* <div className="flex space-x-4">
            <div className="w-full md:w-2/5">
              <label className={`mb-3 block text-black dark:text-white ${i18n.language=="ar" && "text-end"}`}>
                Phone
              </label>
              <Field
                type="number"
                name="phone"
                placeholder="Phone Number"
                className="w-full  bg-white rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
              />
              <ErrorMessage
                name="phone"
                component="div"
                className="text-danger"
              />
            </div>
          </div> */}
          <div
            className="flex flex-col md:flex-row md:space-x-4"
            style={{ direction: i18n.language == 'ar' ? 'rtl' : 'ltr' }}
          >
            <div className="w-full md:w-2/5">
              <label
                className={`mb-3 block text-black dark:text-white `}
                style={{ direction: i18n.language == 'ar' ? 'rtl' : 'ltr' }}
              >
                {t('User Email')}
              </label>
              <Field
                type="text"
                style={{ direction: i18n.language == 'ar' ? 'rtl' : 'ltr' }}
                name="email"
                placeholder="User Email"
                className="w-full  bg-white rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
              />
              <ErrorMessage
                name="email"
                component="div"
                className="text-danger"
              />
            </div>
          </div>

          <div
            className="flex space-x-4"
            style={{ direction: i18n.language == 'ar' ? 'rtl' : 'ltr' }}
          >
            <div className="w-full md:w-2/5">
              <label
                className={`mb-3 block text-black dark:text-white `}
                style={{ direction: i18n.language == 'ar' ? 'rtl' : 'ltr' }}
              >
                {t('Password')}
              </label>
              <Field
                type="password"
                name="password"
                style={{ direction: i18n.language == 'ar' ? 'rtl' : 'ltr' }}
                placeholder="Password"
                className="w-full  bg-white rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
              />
              <ErrorMessage
                name="password"
                component="div"
                className="text-danger"
              />
            </div>
          </div>
          <div
            className="flex flex-col w-2/5"
            style={{ direction: i18n.language == 'ar' ? 'rtl' : 'ltr' }}
          >
            <label
              className={`mb-3 block text-black dark:text-white`}
              style={{ direction: i18n.language == 'ar' ? 'rtl' : 'ltr' }}
            >
              {t('User Roles')}
            </label>
            <div className="relative z-20 p-4 w-full rounded border border-stroke p-1.5 pr-8 font-medium outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input">
              <div className="flex flex-wrap items-center">
                {formikObj.values.roles?.map((I: String, ind) => (
                  <span
                    className="m-1.5 flex items-center justify-center rounded border-[.5px] border-stroke bg-gray py-1.5 px-2.5 text-sm font-medium dark:border-strokedark dark:bg-white/30 z-50"
                    key={ind}
                  >
                    {I}
                    <span
                      className="cursor-pointer pl-2 hover:text-danger"
                      onClick={() => {
                        formikObj.setFieldValue(
                          'roles',
                          formikObj.values.roles.filter((e) => e !== I),
                        );
                      }}
                    >
                      <svg
                        width="12"
                        height="12"
                        viewBox="0 0 12 12"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          fillRule="evenodd"
                          clipRule="evenodd"
                          d="M9.35355 3.35355C9.54882 3.15829 9.54882 2.84171 9.35355 2.64645C9.15829 2.45118 8.84171 2.45118 8.64645 2.64645L6 5.29289L3.35355 2.64645C3.15829 2.45118 2.84171 2.45118 2.64645 2.64645C2.45118 2.84171 2.45118 3.15829 2.64645 3.35355L5.29289 6L2.64645 8.64645C2.45118 8.84171 2.45118 9.15829 2.64645 9.35355C2.84171 9.54882 3.15829 9.54882 3.35355 9.35355L6 6.70711L8.64645 9.35355C8.84171 9.54882 9.15829 9.54882 9.35355 9.35355C9.54882 9.15829 9.54882 8.84171 9.35355 8.64645L6.70711 6L9.35355 3.35355Z"
                          fill="currentColor"
                        ></path>
                      </svg>
                    </span>
                  </span>
                ))}
              </div>
              <Field
                as="select"
                name="roles"
                placeholder="roles"
                className="absolute top-0 p-6 left-0 z-20 h-full w-full bg-transparent opacity-0"
                style={{ direction: i18n.language == 'ar' ? 'rtl' : 'ltr' }}
                onChange={(e: any) => {
                  if (!formikObj.values.roles.includes(e.target.value))
                    formikObj.setFieldValue('roles', [
                      ...formikObj.values.roles,
                      e.target.value,
                    ]);
                }}
              >
                <option className="text-black" value="">
                  {t('Select')}
                </option>
                <option className="text-black" value="User All">
                  {t('User All')}
                </option>
                <option className="text-black" value="User Read">
                  {t('User Read')}
                </option>
                <option className="text-black" value="User Create">
                  {t('User Create')}
                </option>
                <option className="text-black" value="User Delete">
                  {t('User Delete')}
                </option>
                <option className="text-black" value="User Update">
                  {t('User Update')}
                </option>
                <option className="text-black" value="Contract All">
                  {t('Contract All')}
                </option>
                <option className="text-black" value="Contract Read">
                  {t('Contract Read')}
                </option>
                <option className="text-black" value="Contract Create">
                  {t('Contract Create')}
                </option>
                <option className="text-black" value="Contract Delete">
                  {t('Contract Delete')}
                </option>
                <option className="text-black" value="Contract Update">
                  {t('Contract Update')}
                </option>
              </Field>
              <span className="absolute top-1/2 right-4 z-10 -translate-y-1/2">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <g opacity="0.8">
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M5.29289 8.29289C5.68342 7.90237 6.31658 7.90237 6.70711 8.29289L12 13.5858L17.2929 8.29289C17.6834 7.90237 18.3166 7.90237 18.7071 8.29289C19.0976 8.68342 19.0976 9.31658 18.7071 9.70711L12.7071 15.7071C12.3166 16.0976 11.6834 16.0976 11.2929 15.7071L5.29289 9.70711C4.90237 9.31658 4.90237 8.68342 5.29289 8.29289Z"
                      fill="#637381"
                    ></path>
                  </g>
                </svg>
              </span>
              <ErrorMessage
                name="roles"
                component="div"
                className="text-danger"
              />
            </div>
          </div>
        </div>
        <div style={{ direction: i18n.language == 'ar' ? 'rtl' : 'ltr' }}>
          <button
            className="w-52 rounded bg-primary p-3 font-medium text-gray"
            type="submit"
          >
            {loading ? (
              <LoaderIcon className="h-8 w-8 mx-auto" />
            ) : (
              t('Add User')
            )}
          </button>
        </div>
      </form>
    </FormikProvider>
  );
}

export default AddUsers;
