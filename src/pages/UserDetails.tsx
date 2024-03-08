import { Timestamp, doc, updateDoc } from 'firebase/firestore';
import React, { useCallback, useEffect, useState } from 'react';
import { useLocation, useNavigate, useNavigation } from 'react-router-dom';
//@ts-ignore
import { db } from '../firebase.js';
import { toast } from 'react-toastify';
import { LoaderIcon } from 'react-hot-toast';
import useUserAuth from '../store/useUserAuth.js';
import DynamicFirebaseImageComponent from '../components/DynamicFirebaseImageComponent.js';
import { useTranslation } from 'react-i18next';
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
  const [userapproval, setuserapproval] = useState<string>('');

  const [isloading, setisloading] = useState<boolean>(false);
  const [statusisloading, setstatusisloading] = useState<boolean>(false);

  const { setuser, ...user } = useUserAuth();
  const changeUserStatus = async () => {
    try {
      if (userStatus === '') return toast.error('Select A Value First');

      setstatusisloading(true);
      await updateDoc(doc(db, 'users', user.uid), {
        status: userStatus,
      });
      toast.success('Status Changed');
      setuser({ ...user, status: userStatus });
      // setuserUpdatedStatus(userStatus);
    } catch (e) {
      toast.error('Failed To Change Status');
    } finally {
      setstatusisloading(false);
    }
  };
  const changeUserApproval = async () => {
    try {
      if (userapproval === '') return toast.error('Select A Value First');
      setisloading(true);
      await updateDoc(doc(db, 'users', user.uid), {
        approval: userapproval,
      });
      toast.success('Status Changed');
      setuser({ ...user, approval: userapproval });
      // setuserUpdatedStatus(userStatus);
    } catch (e) {
      toast.error('Failed To Change Approval');
    } finally {
      setisloading(false);
    }
  };
  console.log(user);
  const removeImage = useCallback(() => {}, []);
  const { t, i18n } = useTranslation();
  return (
    <div style={{ direction: i18n.language == 'ar' ? 'rtl' : 'ltr' }}>
      <h1 className="text-4xl text-black dark:text-white">
        {t('User Details')}
      </h1>
      <div className="flex flex-col gap-5.5 p-6.5">
        {/* <h1 className="text-2xl text-black dark:text-white">
          Placed <OrderTimeAgo orderTimestamp={order.appointmentDate} />
        </h1> */}
        <div className="flex flex-col lg:flex-row lg:justify-between">
          <h1 className="text-xl text-black dark:text-white">
            {t('Name')} : {user.name}
          </h1>
          <h1 className="text-2xl lg:text-3xl text-black dark:text-meta-8">
            {user.email}
          </h1>
          <h1 className="text-3xl text-black dark:text-meta-7">{user.date}</h1>
        </div>

        <div className=" mb-7.5 flex flex-wrap gap-5 xl:gap-7.5">
          <div className=" space-y-4 lg:space-y-0 flex flex-col lg:flex-row lg:items-center lg:justify-between w-full">
            <div>
              <h1>{t('User Status')}</h1>
              <div className="inline-flex items-center justify-center gap-2.5 rounded-md bg-meta-3 py-4 px-10 text-center font-medium text-white hover:bg-opacity-90 lg:px-8 xl:px-10">
                {user.status || 'Pending'}
              </div>
            </div>
            {(user.role?.includes('User All') ||
              user.role?.includes('User Update')) && (
              <>
                {' '}
                <div>
                  <h1>{t('Change User Status')}</h1>
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
                        {t('Select')}
                      </option>
                      <option
                        className="text-black px-5 my-5"
                        value={'Blocked'}
                      >
                        {t('Blocked')}
                      </option>
                      <option
                        className="text-black px-5 my-5"
                        value={'Unblocked'}
                      >
                        {t('Unblocked')}
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
                  disabled={statusisloading}
                >
                  {statusisloading ? (
                    <LoaderIcon className="w-6 h-6" />
                  ) : (
                    t('Change Status')
                  )}
                </button>
              </>
            )}
          </div>
        </div>
        <div className="mb-7.5 flex flex-wrap gap-5 xl:gap-7.5">
          <div className=" space-y-4 lg:space-y-0 flex flex-col lg:flex-row lg:items-center lg:justify-between w-full">
            <div>
              <h1>{t('User Approval')}</h1>
              <div className="inline-flex items-center justify-center gap-2.5 rounded-md bg-meta-3 py-4 px-10 text-center font-medium text-white hover:bg-opacity-90 lg:px-8 xl:px-10">
                {user.approval || t('Pending')}
              </div>
            </div>
            {(user.role?.includes('User All') ||
              user.role?.includes('User Update')) && (
              <>
                <div>
                  <h1>{t('Change User Approval')}</h1>
                  <div className="relative z-20 p-1 w-full rounded border border-stroke pr-8 font-medium outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input">
                    <select
                      className="top-0 left-0 z-20 h-full w-full outline-none bg-transparent appearance-none cursor-pointer"
                      defaultValue={''}
                      onChange={(e) => {
                        setuserapproval(e.target.value);
                      }}
                    >
                      <option
                        className="text-black px-5 my-5"
                        value={''}
                        disabled
                        hidden
                      >
                        {t('Select')}
                      </option>
                      <option
                        className="text-black px-5 my-5"
                        value={'Pending'}
                      >
                        {t('Pending')}
                      </option>
                      <option
                        className="text-black px-5 my-5"
                        value={'Approved'}
                      >
                        {t('Approved')}
                      </option>
                      <option
                        className="text-black px-5 my-5"
                        value={'Disapproved'}
                      >
                        {t('Disapproved')}
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
                  onClick={changeUserApproval}
                  disabled={isloading}
                >
                  {isloading ? (
                    <LoaderIcon className="w-6 h-6" />
                  ) : (
                    t('Change Approval')
                  )}
                </button>
              </>
            )}
          </div>
        </div>
        <hr></hr>
        <div className="flex flex-col md:flex-row items-center space-x-0 md:space-x-4 justify-start">
          <div className="w-full md:w-2/5">
            <h1 className="mb-3 block text-black dark:text-bodydark">
              {t('Customer Name')}
            </h1>
            <h2 className="mb-3 block text-black dark:text-white">
              {user.name}
            </h2>
          </div>
          <div className="w-full md:w-2/5">
            <h1 className="mb-3 block text-black dark:text-bodydark">
              {t('Customer Number')}
            </h1>
            <h2 className="mb-3 block text-black dark:text-white">
              {user.phoneNo}
            </h2>
          </div>
          <div className="w-full md:w-2/5">
            <h1 className="mb-3 block text-black dark:text-bodydark">
              {t('AlDolat')}
            </h1>
            <h2 className="mb-3 block text-black dark:text-white">
              {user.aldolat}
            </h2>
          </div>
        </div>
        <div className="flex flex-col md:flex-row items-center space-x-0 md:space-x-4 justify-start">
          <div className="w-full md:w-2/5">
            <h1 className="mb-3 block text-black dark:text-bodydark">
              {t('Almadina')}
            </h1>
            <h1 className="mb-3 block text-black dark:text-white">
              {user.almadina}
            </h1>
          </div>
          <div className="w-full md:w-2/5">
            <h1 className="mb-3 block text-black dark:text-bodydark">
              {t('Almontaqatha')}
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
        <hr></hr>

        {user.capacity && user.capacity === 'Company' && (
          <>
            <h1 className="text-4xl text-black dark:text-white">
              {t('Company Details')}
            </h1>

            <div className="flex flex-col md:flex-row items-center space-x-0 md:space-x-4 justify-start">
              <div className="w-full md:w-2/5">
                <h1 className="mb-3 block text-black dark:text-bodydark">
                  {t('Wakeel Name')}
                </h1>
                <h1 className="mb-3 block text-black dark:text-white">
                  {user.wakeelName}
                </h1>
              </div>
              <div className="w-full md:w-2/5">
                <h1 className="mb-3 block text-black dark:text-bodydark">
                  {t('Wakeel PNO')}
                </h1>
                <h1 className="mb-3 block text-black dark:text-white">
                  {user.wakeelPNO}
                </h1>
              </div>
              <div className="w-full md:w-2/5">
                <h1 className="mb-3 block text-black dark:text-bodydark">
                  {t('Wakeel Cnic')}
                </h1>
                <h1 className="mb-3 block text-black dark:text-white">
                  {user.wakeelCNIC}
                </h1>
              </div>
            </div>
            <div className="flex flex-col md:flex-row items-center space-x-0 md:space-x-4 justify-start">
              <div className="w-full md:w-2/5">
                <h1 className="mb-3 block text-black dark:text-bodydark">
                  {t('Wakeel Description')}
                </h1>
                <h1 className="mb-3 block text-black dark:text-white">
                  {user.wakeelDescription}
                </h1>
              </div>
              <div className="w-full md:w-2/5">
                <h1 className="mb-3 block text-black dark:text-bodydark">
                  {t('Wakeel Date')}
                </h1>
                <h1 className="mb-3 block text-black dark:text-white">
                  {user.wakeelDate}
                </h1>
              </div>
            </div>
            <div className="flex flex-col md:flex-row items-center space-x-0 md:space-x-4 justify-start">
              {user.wakeelAttachedFile1 && (
                <div className="w-full md:w-2/5">
                  <h1 className="mb-3 block text-black dark:text-bodydark">
                    {t('Attachment')} 1
                  </h1>
                  <h1 className="mb-3 block text-black dark:text-white">
                    <DynamicFirebaseImageComponent
                      storagePath={user.wakeelAttachedFile1!}
                      removeImage={removeImage}
                    />
                  </h1>
                </div>
              )}
              {user.wakeelAttachedFile2 && (
                <div className="w-full md:w-2/5">
                  <h1 className="mb-3 block text-black dark:text-bodydark">
                    {t('Attachment')} 2
                  </h1>
                  <h1 className="mb-3 block text-black dark:text-white">
                    <DynamicFirebaseImageComponent
                      storagePath={user.wakeelAttachedFile1!}
                      removeImage={removeImage}
                    />
                  </h1>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default UserDetails;

// Example usage
