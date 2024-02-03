import { Timestamp, doc, updateDoc } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
//@ts-ignore
import { db } from '../firebase.js';
import { toast } from 'react-toastify';
import { LoaderIcon } from 'react-hot-toast';
type Orders = {
  id: string;
  orderNumber: string;
  customer: string;
  service: string;
  worker: string;
  total: number;
  status: string;
  type: string;
  appointmentDate: Timestamp;
  paymentMethod: string;
  selectedDate: Timestamp;
  selectedTime: string;

  uid: string;
};
function UserDetails() {
  const [userStatus, setuserStatus] = useState<string>('');
  const [isloading, setisloading] = useState<boolean>(false);
  const { state } = useLocation();
  const user: WebsiteUsers = state.user;
  const changeUserStatus = async () => {
    try {
      setisloading(true);
      await updateDoc(doc(db, 'users', user.uid), {
        status: userStatus,
      });
      toast.success('Status Changed');
    } catch (e) {
      toast.error('Failed To Change Status');
    } finally {
      setisloading(false);
    }
  };
  console.log(user);
  return (
    <div>
      <h1 className="text-4xl text-black dark:text-white">User Details</h1>
      <div className="flex flex-col gap-5.5 p-6.5">
        {/* <h1 className="text-2xl text-black dark:text-white">
          Placed <OrderTimeAgo orderTimestamp={order.appointmentDate} />
        </h1> */}
        <div className="flex flex-col lg:flex-row lg:justify-between">
          <h1 className="text-xl text-black dark:text-white">
            Name : {user.name}
          </h1>
          <h1 className="text-3xl text-black dark:text-meta-8">{user.email}</h1>
          <h1 className="text-3xl text-black dark:text-meta-7">{user.date}</h1>
        </div>

        <div className="mb-7.5 flex flex-wrap gap-5 xl:gap-7.5">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between w-full">
            <div>
              <h1>User Status</h1>
              <div className="inline-flex items-center justify-center gap-2.5 rounded-md bg-meta-3 py-4 px-10 text-center font-medium text-white hover:bg-opacity-90 lg:px-8 xl:px-10">
                {user.status || 'Pending'}
              </div>
            </div>
            <div>
              <h1>Change User Status</h1>
              <div className="relative z-20 p-1 w-full rounded border border-stroke pr-8 font-medium outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input">
                <select
                  className="top-0 left-0 z-20 h-full w-full outline-none bg-transparent appearance-none cursor-pointer"
                  defaultValue={''}
                  onChange={(e) => {
                    setuserStatus(e.target.value);
                  }}
                >
                  <option
                    className="text-black px-5 my-5"
                    value={''}
                    disabled
                    hidden
                  >
                    Select
                  </option>
                  <option className="text-black px-5 my-5" value={'Blocked'}>
                    Blocked
                  </option>
                  <option className="text-black px-5 my-5" value={'unblocked'}>
                    Unblocked
                  </option>
                </select>
                <span className="absolute top-1/2 right-4 z-10 -translate-y-1/2 pointer-events-none">
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
              </div>
            </div>

            <button
              className="inline-flex items-center justify-center gap-2.5 rounded-md bg-primary py-2 px-8 text-center font-medium text-white hover:bg-opacity-90 xl:px-5"
              onClick={changeUserStatus}
              disabled={isloading}
            >
              {isloading ? <LoaderIcon className="w-6 h-6" /> : 'Change Status'}
            </button>
          </div>
        </div>
        <hr></hr>
        <div className="flex flex-col md:flex-row items-center space-x-0 md:space-x-4 justify-start">
          <div className="w-full md:w-2/5">
            <h1 className="mb-3 block text-black dark:text-bodydark">
              Customer Name
            </h1>
            <h2 className="mb-3 block text-black dark:text-white">
              {user.name}
            </h2>
          </div>
          <div className="w-full md:w-2/5">
            <h1 className="mb-3 block text-black dark:text-bodydark">
              Customer Number
            </h1>
            <h2 className="mb-3 block text-black dark:text-white">
              {user.phoneNo}
            </h2>
          </div>
          <div className="w-full md:w-2/5">
            <h1 className="mb-3 block text-black dark:text-bodydark">
              AlDolat
            </h1>
            <h2 className="mb-3 block text-black dark:text-white">
              {user.aldolat}
            </h2>
          </div>
        </div>
        <div className="flex flex-col md:flex-row items-center space-x-0 md:space-x-4 justify-start">
          <div className="w-full md:w-2/5">
            <h1 className="mb-3 block text-black dark:text-bodydark">
              Almadina
            </h1>
            <h1 className="mb-3 block text-black dark:text-white">
              {user.almadina}
            </h1>
          </div>
          <div className="w-full md:w-2/5">
            <h1 className="mb-3 block text-black dark:text-bodydark">
              Almontaqatha
            </h1>
            <h1 className="mb-3 block text-black dark:text-white">
              {user.almontaqatha}
            </h1>
          </div>
          <div className="w-full md:w-2/5">
            <h1 className="mb-3 block text-black dark:text-bodydark">Cnic</h1>
            <h1 className="mb-3 block text-black dark:text-white">
              {user.cnic}
            </h1>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserDetails;

// Example usage
