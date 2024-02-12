import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LoaderIcon } from 'react-hot-toast';
import { toast } from 'react-toastify';
import {
  getDocs,
  collection,
  deleteDoc,
  doc,
  query,
  where,
  runTransaction,
} from 'firebase/firestore';
import { type Timestamp } from 'firebase/firestore';
// @ts-ignore
import { db } from '../firebase.js';
import useUserAuth from '../store/useUserAuth.js';

function ApprovedUsers() {
  const [showAlert, setshowAlert] = useState(false);
  const navigate = useNavigate();
  const [loading, setisloading] = useState<boolean>(false);
  const [reload, setreload] = useState<boolean>(false);
  const [filterValue, setfilterValue] = useState<string>('');

  const [todelete, settodelete] = useState<{ id: string; email: string }>();
  const [isdeleting, setisdeleting] = useState<boolean>(false);
  const [users, setusers] = useState<WebsiteUsers[]>([]);
  const [page, setpage] = useState<number>(1);
  const ItemsperPage = 10;
  const totalPages = Math.ceil((users.length || 1) / ItemsperPage);
  const startIndex = (page - 1) * ItemsperPage;
  const endIndex = startIndex + ItemsperPage;
  const currentItems = users.slice(startIndex, endIndex);
  const { setuser } = useUserAuth();
  const getUsers = useCallback(async () => {
    try {
      setisloading((p) => true);
      const qs = await getDocs(
        query(collection(db, 'users'), where('approval', '==', 'Approved')),
      );
      const usersData: WebsiteUsers[] = [];
      qs.forEach((doc) => {
        const newUserData = {
          ...(doc.data() as WebsiteUsers),
        };
        usersData.push(newUserData);
      });
      setusers(usersData);
    } catch (e) {
      console.log(e);
    } finally {
      setisloading((p) => false);
    }
  }, []);
  console.log(isdeleting, 'is deleting');
  useEffect(() => {
    getUsers();
  }, [reload]);
  console.log(users, 'isers');
  const filterUsers = useCallback(async () => {
    try {
      console.log(filterValue);
      if (!filterValue) return toast.error('Select Filter Type First');
      setisloading((p) => true);
      const qs = await getDocs(
        query(
          collection(db, 'users'),
          where('approval', '==', 'Approved'),
          where('capacity', '==', filterValue),
        ),
      );
      const usersData: WebsiteUsers[] = [];
      qs.forEach((doc) => {
        const newUserData = {
          ...(doc.data() as WebsiteUsers),
        };
        usersData.push(newUserData);
      });
      setusers(usersData);
    } catch (e) {
    } finally {
      setisloading((p) => false);
    }
  }, [filterValue]);
  return (
    <div className="w-full overflow-x-auto">
      <h1 className="text-2xl my-5">Approved Users</h1>
      <div className="flex flex-col lg:flex-row w-3/5 justify-between items-center mb-25">
        <label className="mb-3 block text-black dark:text-white">
          Filter By
        </label>
        <select
          name="type"
          className="w-2/5  bg-white rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
          onChange={(e) => {
            console.log('changed', e.target.value);
            setfilterValue(e.target.value!);
          }}
        >
          <option value={''}>Select</option>
          <option value={'User'}>User</option>
          <option value={'Company'}>Company</option>
        </select>
        <button
          className="inline-flex items-center justify-center disabled:cursor-default rounded-md bg-success py-4 px-10 text-center font-medium text-white hover:bg-opacity-90 lg:px-8 xl:px-10 disabled:bg-body"
          onClick={filterUsers}
        >
          Filter
        </button>
      </div>
      {showAlert && (
        <div className="w-1/5 md:w-4/5 right-0 absolute flex bg-boxdark-2  border-l-6 border-[#F87171] z-50   px-7 py-8 shadow-md  md:p-9">
          <div className="mr-5 flex h-9 w-full max-w-[36px] items-center justify-center rounded-lg ">
            <svg
              width="13"
              height="13"
              viewBox="0 0 13 13"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              onClick={() => setshowAlert(false)}
              className="cursor-pointer"
            >
              <path
                d="M6.4917 7.65579L11.106 12.2645C11.2545 12.4128 11.4715 12.5 11.6738 12.5C11.8762 12.5 12.0931 12.4128 12.2416 12.2645C12.5621 11.9445 12.5623 11.4317 12.2423 11.1114C12.2422 11.1113 12.2422 11.1113 12.2422 11.1113C12.242 11.1111 12.2418 11.1109 12.2416 11.1107L7.64539 6.50351L12.2589 1.91221L12.2595 1.91158C12.5802 1.59132 12.5802 1.07805 12.2595 0.757793C11.9393 0.437994 11.4268 0.437869 11.1064 0.757418C11.1063 0.757543 11.1062 0.757668 11.106 0.757793L6.49234 5.34931L1.89459 0.740581L1.89396 0.739942C1.57364 0.420019 1.0608 0.420019 0.740487 0.739944C0.42005 1.05999 0.419837 1.57279 0.73985 1.89309L6.4917 7.65579ZM6.4917 7.65579L1.89459 12.2639L1.89395 12.2645C1.74546 12.4128 1.52854 12.5 1.32616 12.5C1.12377 12.5 0.906853 12.4128 0.758361 12.2645L1.1117 11.9108L0.758358 12.2645C0.437984 11.9445 0.437708 11.4319 0.757539 11.1116C0.757812 11.1113 0.758086 11.111 0.75836 11.1107L5.33864 6.50287L0.740487 1.89373L6.4917 7.65579Z"
                fill="#ffffff"
                stroke="#ffffff"
              ></path>
            </svg>
          </div>
          <div className="w-full">
            <h5 className="mb-3 font-semibold text-[#B45454]">
              Are You Sure You Want To Delete This Item
            </h5>
            <ul>
              <li
                className="leading-relaxed text-[#CD5D5D]"
                onClick={async () => {
                  try {
                    setisdeleting(true);
                    console.log(todelete);
                    let myquery = query(
                      collection(db, 'staff'),
                      where('email', '==', todelete?.email),
                    );
                    const userDoc = doc(db, 'users', todelete?.id!);
                    runTransaction(db, async (transaction) => {
                      // await deleteDoc(userDoc);
                      transaction.delete(userDoc);
                      // Execute the query
                      const querySnapshot = await getDocs(myquery);
                      if (!querySnapshot.empty) {
                        querySnapshot.forEach(async (d) => {
                          const staffDoc = doc(db, 'staff', d.id);
                          transaction.delete(staffDoc);
                        });
                      } else {
                        console.log('empty snapshot', querySnapshot.empty);
                      }
                      settodelete({ email: '', id: '' });
                      setshowAlert(false);
                      setreload(true);
                      toast.success('Deleted');
                    });
                  } catch (e) {
                    console.log(e);
                    toast.error('Failed To Delete');
                  } finally {
                    setisdeleting(false);
                  }
                }}
              >
                <button
                  className="inline-flex items-center justify-center gap-2.5 rounded-full border border-danger py-4 px-10 text-center font-medium text-primary hover:bg-opacity-90 lg:px-8 xl:px-10"
                  disabled={isdeleting}
                >
                  {isdeleting ? <LoaderIcon className="h-5 w-5" /> : 'Yes'}
                </button>
              </li>
            </ul>
          </div>
        </div>
      )}

      <div className="flex flex-col my-4 overflow-x-auto min-w-max">
        <table className="w-full ">
          <thead>
            <tr className="grid rounded-sm w-full bg-gray-2 dark:bg-form-strokedark grid-cols-6 gap-4 md:gap-8">
              <th className="p-3 md:w-1/5 lg:w-1/4">
                <h5 className="text-sm font-medium uppercase xsm:text-base whitespace-normal">
                  Name
                </h5>
              </th>
              <th className="p-3 md:w-1/5 lg:w-1/4">
                <h5 className="text-sm font-medium uppercase xsm:text-base whitespace-normal">
                  Email
                </h5>
              </th>
              <th className="p-3 md:w-1/6 lg:w-1/8">
                <h5 className="text-sm font-medium uppercase xsm:text-base whitespace-normal">
                  Phone
                </h5>
              </th>
              <th className="p-3 md:w-1/6 lg:w-1/8">
                <h5 className="text-sm font-medium uppercase xsm:text-base whitespace-normal">
                  CNIC
                </h5>
              </th>
              <th className="p-3 md:w-1/5 lg:w-1/4">
                <h5 className="text-sm font-medium uppercase xsm:text-base whitespace-normal">
                  Actions
                </h5>
              </th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td className="text-center">
                  <LoaderIcon
                    className="h-20 my-10 w-20 mx-auto"
                    secondary="blue"
                  />
                </td>
              </tr>
            )}
            {!loading &&
              currentItems &&
              currentItems.map((u) => (
                <tr
                  className="grid w-full rounded-sm bg-gray-2 dark:bg-meta-4 grid-cols-6 gap-4 md:gap-8 items-start overflow-auto"
                  key={u.uid}
                >
                  <td className="p-3 w-3/5 md:w-1/5 lg:w-1/4">
                    <h5 className="text-sm font-medium uppercase xsm:text-base whitespace-normal">
                      {u.name}
                    </h5>
                  </td>
                  <td className="p-3 w-3/5 md:w-1/5 lg:w-1/4">
                    <h5 className="text-sm font-medium xsm:text-base whitespace-normal">
                      {u.email}
                    </h5>
                  </td>
                  <td className="p-3 w-3/5 md:w-1/5 lg:w-1/4">
                    <h5 className="text-sm font-medium xsm:text-base whitespace-normal">
                      {u.phoneNo}
                    </h5>
                  </td>
                  <td className="p-3 w-3/5 md:w-1/6 lg:w-1/8">
                    <h5 className="text-sm font-medium uppercase xsm:text-base whitespace-normal">
                      {u.cnic}
                    </h5>
                  </td>
                  <td className="p-3 w-3/5 md:w-1/5 lg:w-1/4">
                    <h5
                      className="text-sm font-medium cursor-pointer xsm:text-base whitespace-normal hover:text-meta-6"
                      onClick={() => {
                        console.log('user', u);
                        setuser(u);
                        navigate('/userDetails');
                      }}
                    >
                      View Details
                    </h5>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      <div className="my-10 mx-15">
        <div className="flex flex-wrap gap-5 xl:gap-7.5 items-center">
          <button
            className="inline-flex items-center
            disabled:bg-body
            justify-center gap-2.5 rounded-md bg-primary py-4 px-10 text-center font-medium text-white hover:bg-opacity-90 lg:px-8 xl:px-10"
            disabled={page === 1}
            onClick={() => {
              if (page == 1) return;
              setpage((p) => p - 1);
            }}
          >
            <span>
              <svg
                className="fill-current"
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g clipPath="url(#clip0_182_46495)">
                  <path
                    d="M18.875 11.4375C18.3125 10.8438 17.5625 10.5312 16.75 10.5312C16.125 10.5312 15.5625 10.7188 15.0625 11.0938C15 11.125 14.9688 11.1562 14.9062 11.2188C14.8438 11.1875 14.8125 11.125 14.75 11.0938C14.25 10.7188 13.6875 10.5312 13.0625 10.5312C12.9062 10.5312 12.7812 10.5312 12.6562 10.5625C11.7188 9.5 10.5625 8.75 9.3125 8.40625C10.625 7.75 11.5312 6.40625 11.5312 4.875C11.5312 2.6875 9.75 0.9375 7.59375 0.9375C5.40625 0.9375 3.65625 2.71875 3.65625 4.875C3.65625 6.4375 4.5625 7.78125 5.875 8.40625C4.5625 8.78125 3.40625 9.53125 2.4375 10.6562C1.125 12.2188 0.375 14.4062 0.3125 16.7812C0.3125 17.0312 0.4375 17.25 0.65625 17.3438C1.5 17.75 4.4375 19.0938 7.59375 19.0938C9.28125 19.0938 10.8438 18.8125 10.9062 18.8125C11.25 18.75 11.4688 18.4375 11.4062 18.0938C11.3438 17.75 11.0312 17.5312 10.6875 17.5938C10.6875 17.5938 9.15625 17.875 7.59375 17.875C5.0625 17.8438 2.65625 16.875 1.5625 16.375C1.65625 14.4375 2.3125 12.7187 3.375 11.4375C4.46875 10.125 5.96875 9.40625 7.59375 9.40625C9.03125 9.40625 10.375 10 11.4375 11.0312C11.2812 11.1562 11.125 11.2812 11 11.4062C10.4688 11.9688 10.1875 12.75 10.1875 13.5938C10.1875 14.4375 10.5 15.2188 11.1562 16C11.6875 16.6562 12.4375 17.2812 13.2812 18L13.3125 18.0312C13.5937 18.25 13.9062 18.5312 14.2188 18.8125C14.4062 19 14.6875 19.0938 14.9375 19.0938C15.1875 19.0938 15.4687 19 15.6562 18.8125C16 18.5312 16.3125 18.25 16.5938 18C17.4375 17.2812 18.1875 16.6562 18.7188 16C19.375 15.2188 19.6875 14.4375 19.6875 13.5938C19.6875 12.7812 19.4062 12.0312 18.875 11.4375ZM4.875 4.875C4.875 3.375 6.09375 2.1875 7.5625 2.1875C9.0625 2.1875 10.25 3.40625 10.25 4.875C10.25 6.375 9.03125 7.5625 7.5625 7.5625C6.09375 7.5625 4.875 6.34375 4.875 4.875ZM17.75 15.2188C17.2812 15.7812 16.5938 16.375 15.7812 17.0625C15.5312 17.2812 15.2188 17.5312 14.9062 17.7812C14.625 17.5312 14.3438 17.2812 14.0938 17.0938L14.0625 17.0625C13.25 16.375 12.5625 15.7812 12.0938 15.2188C11.625 14.6562 11.4062 14.1562 11.4062 13.625C11.4062 13.0937 11.5938 12.625 11.9062 12.2812C12.2188 11.9375 12.6563 11.75 13.0938 11.75C13.4375 11.75 13.75 11.8438 14 12.0625C14.125 12.1562 14.2188 12.25 14.3125 12.375C14.5938 12.7188 15.1875 12.7188 15.5 12.375C15.5938 12.25 15.7187 12.1562 15.8125 12.0625C16.0937 11.8438 16.4062 11.75 16.7188 11.75C17.1875 11.75 17.5938 11.9375 17.9062 12.2812C18.2188 12.625 18.4062 13.0937 18.4062 13.625C18.4375 14.1875 18.2188 14.6562 17.75 15.2188Z"
                    fill=""
                  />
                </g>
                <defs>
                  <clipPath id="clip0_182_46495">
                    <rect width="20" height="20" fill="white" />
                  </clipPath>
                </defs>
              </svg>
            </span>
            Previous
          </button>
          <h2>Page {page}</h2>
          <button
            className="inline-flex items-center justify-center gap-2.5 disabled:cursor-default rounded-md bg-primary py-4 px-10 text-center font-medium text-white hover:bg-opacity-90 lg:px-8 xl:px-10 disabled:bg-body"
            disabled={page == totalPages}
            onClick={() => {
              if (page < totalPages) {
                setpage((p) => p + 1);
              }
            }}
          >
            <span>
              <svg
                className="fill-current"
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g clipPath="url(#clip0_182_46495)">
                  <path
                    d="M18.875 11.4375C18.3125 10.8438 17.5625 10.5312 16.75 10.5312C16.125 10.5312 15.5625 10.7188 15.0625 11.0938C15 11.125 14.9688 11.1562 14.9062 11.2188C14.8438 11.1875 14.8125 11.125 14.75 11.0938C14.25 10.7188 13.6875 10.5312 13.0625 10.5312C12.9062 10.5312 12.7812 10.5312 12.6562 10.5625C11.7188 9.5 10.5625 8.75 9.3125 8.40625C10.625 7.75 11.5312 6.40625 11.5312 4.875C11.5312 2.6875 9.75 0.9375 7.59375 0.9375C5.40625 0.9375 3.65625 2.71875 3.65625 4.875C3.65625 6.4375 4.5625 7.78125 5.875 8.40625C4.5625 8.78125 3.40625 9.53125 2.4375 10.6562C1.125 12.2188 0.375 14.4062 0.3125 16.7812C0.3125 17.0312 0.4375 17.25 0.65625 17.3438C1.5 17.75 4.4375 19.0938 7.59375 19.0938C9.28125 19.0938 10.8438 18.8125 10.9062 18.8125C11.25 18.75 11.4688 18.4375 11.4062 18.0938C11.3438 17.75 11.0312 17.5312 10.6875 17.5938C10.6875 17.5938 9.15625 17.875 7.59375 17.875C5.0625 17.8438 2.65625 16.875 1.5625 16.375C1.65625 14.4375 2.3125 12.7187 3.375 11.4375C4.46875 10.125 5.96875 9.40625 7.59375 9.40625C9.03125 9.40625 10.375 10 11.4375 11.0312C11.2812 11.1562 11.125 11.2812 11 11.4062C10.4688 11.9688 10.1875 12.75 10.1875 13.5938C10.1875 14.4375 10.5 15.2188 11.1562 16C11.6875 16.6562 12.4375 17.2812 13.2812 18L13.3125 18.0312C13.5937 18.25 13.9062 18.5312 14.2188 18.8125C14.4062 19 14.6875 19.0938 14.9375 19.0938C15.1875 19.0938 15.4687 19 15.6562 18.8125C16 18.5312 16.3125 18.25 16.5938 18C17.4375 17.2812 18.1875 16.6562 18.7188 16C19.375 15.2188 19.6875 14.4375 19.6875 13.5938C19.6875 12.7812 19.4062 12.0312 18.875 11.4375ZM4.875 4.875C4.875 3.375 6.09375 2.1875 7.5625 2.1875C9.0625 2.1875 10.25 3.40625 10.25 4.875C10.25 6.375 9.03125 7.5625 7.5625 7.5625C6.09375 7.5625 4.875 6.34375 4.875 4.875ZM17.75 15.2188C17.2812 15.7812 16.5938 16.375 15.7812 17.0625C15.5312 17.2812 15.2188 17.5312 14.9062 17.7812C14.625 17.5312 14.3438 17.2812 14.0938 17.0938L14.0625 17.0625C13.25 16.375 12.5625 15.7812 12.0938 15.2188C11.625 14.6562 11.4062 14.1562 11.4062 13.625C11.4062 13.0937 11.5938 12.625 11.9062 12.2812C12.2188 11.9375 12.6563 11.75 13.0938 11.75C13.4375 11.75 13.75 11.8438 14 12.0625C14.125 12.1562 14.2188 12.25 14.3125 12.375C14.5938 12.7188 15.1875 12.7188 15.5 12.375C15.5938 12.25 15.7187 12.1562 15.8125 12.0625C16.0937 11.8438 16.4062 11.75 16.7188 11.75C17.1875 11.75 17.5938 11.9375 17.9062 12.2812C18.2188 12.625 18.4062 13.0937 18.4062 13.625C18.4375 14.1875 18.2188 14.6562 17.75 15.2188Z"
                    fill=""
                  />
                </g>
                <defs>
                  <clipPath id="clip0_182_46495">
                    <rect width="20" height="20" fill="white" />
                  </clipPath>
                </defs>
              </svg>
            </span>
            Next
          </button>
        </div>
      </div>
    </div>
  );
}

export default ApprovedUsers;
