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
});

function AddUsers() {
  const [loading, setisloading] = useState<boolean>(false);
  const formikObj = useFormik({
    validationSchema,
    initialValues: {
      // Name: '',
      // ArabicName: '',
      // phone: '',
      email: '',
      password: '',
    },
    onSubmit: async (values) => {
      try {
        setisloading(true);
        console.log(values);

        const u = await createUserWithEmailAndPassword(
          auth,
          values.email,
          values.password,
        );
        await setDoc(doc(db, 'admin_user', u.user.uid), {
          // name: values.Name,
          // arabicName: values.ArabicName,
          // phoneNo: values.phone,
          email: values.email,
          role: 'admin',
        });
        toast.success('Successfully Signed Up, Logging In as New User...');
      } catch (e) {
        toast.error('Couldnt Create User ' + e);
      } finally {
        setisloading(false);
      }
    },
  });

  return (
    <FormikProvider value={formikObj}>
      <h1 className="text-2xl my-5">User Information</h1>

      <form onSubmit={formikObj.handleSubmit}>
        {/* <div className="flex flex-col px-6.5 ">

          <div className="flex flex-col items-start space-y-4  justify-around">
            <div className="w-full md:w-2/5">
              <label className="mb-3 block text-black dark:text-white">
                Name
              </label>
              <Field
                type="text"
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
              <label className="mb-3 block text-black dark:text-white">
                الاسم
              </label>
              <Field
                type="text"
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

        <div className="flex flex-col gap-5.5 p-6.5">
          {/* <div className="flex space-x-4">
            <div className="w-full md:w-2/5">
              <label className="mb-3 block text-black dark:text-white">
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
          <div className="flex flex-col md:flex-row md:space-x-4">
            <div className="w-full md:w-2/5">
              <label className="mb-3 block text-black dark:text-white">
                User Email
              </label>
              <Field
                type="text"
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

          <div className="flex space-x-4">
            <div className="w-full md:w-2/5">
              <label className="mb-3 block text-black dark:text-white">
                Password
              </label>
              <Field
                type="password"
                name="password"
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
        </div>
        <button
          className="w-52 rounded bg-primary p-3 font-medium text-gray"
          type="submit"
        >
          {loading ? <LoaderIcon className="h-8 w-8 mx-auto" /> : 'Add User'}
        </button>
      </form>
    </FormikProvider>
  );
}

export default AddUsers;
