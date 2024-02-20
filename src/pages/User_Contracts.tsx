import React, { useCallback, useEffect, useRef, useState } from 'react';
import { LoaderIcon } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  where,
} from 'firebase/firestore';
//@ts-ignore
import { db } from '../firebase';
import { toast } from 'react-hot-toast';

import { ref } from 'firebase/database';
import useContract from '../store/useContract';
import useUserAuth from '../store/useUserAuth';
import useUserContract from '../store/useUserContract';
const UserContracts = () => {
  const [isloading, setisloading] = useState<boolean>(false);
  const [reload, setreload] = useState<boolean>(false);

  const [contracts, setcontracts] = useState<UserContract[]>([]);
  const [filterValue, setfilterValue] = useState<string>('');
  const filterRef = useRef<HTMLInputElement | null>(null);
  const { setcontract } = useUserContract();
  const navigate = useNavigate();
  const getContracts = useCallback(async () => {
    try {
      setisloading(true);
      const cats = await getDocs(collection(db, 'user_contracts'));
      const catarray: UserContract[] = [];
      if (!cats.empty) {
        cats.forEach((cat) =>
          catarray.push({
            ...(cat.data() as UserContract),
            id: cat.id,
          }),
        );
      }
      setcontracts(catarray);
    } catch (e) {
      toast.error('Couldnt Fetch Categories');
    } finally {
      setisloading(false);
      setreload(false);
    }
  }, []);
  const filterUsers = useCallback(async () => {
    try {
      console.log(filterValue);
      console.log(filterRef.current?.value);

      if (!filterValue || !filterRef.current?.value)
        return toast.error('Set Filter Details First');
      setisloading((p) => true);
      const qs = await getDocs(
        query(
          collection(db, 'user_contracts'),
          where(
            filterValue,
            '==',
            filterRef.current?.value!,
          ),
        ),
      );
      const catarray: UserContract[] = [];
      if (!qs.empty) {
        console.log('not emprt');
        qs.forEach((cat) =>
          catarray.push({
            ...(cat.data() as UserContract),
            id: cat.id,
          }),
        );
      }
      setcontracts(catarray);
    } catch (e) {
    } finally {
      setisloading((p) => false);
    }
  }, [filterValue, filterRef]);
  useEffect(() => {
    getContracts();
  }, [reload]);
  return (
    <div>
      <div className="flex flex-col space-y-4 lg:space-y-0 items-start justify-start lg:flex-row w-4/5 space-x-4  lg:justify-between lg:items-center lg:mb-25">
        <label className="mb-3 block text-black dark:text-white">
          Filter By
        </label>
        <select
          name="type"
          className="w-full lg:w-2/5  bg-white rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
          onChange={(e) => {
            setfilterValue(e.target.value!);
          }}
        >
          <option value={''}>Select</option>
          <option value={'contracteeMembershipID'}>Membership Id</option>
          <option value={'baseContractType'}>Contract Type</option>
        </select>
        {filterValue && (
          <input
            className="w-full lg:w-2/5  bg-white rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
            type="text"
            ref={filterRef}
          />
        )}
        <button
          className="inline-flex items-center justify-center disabled:cursor-default rounded-md bg-success py-4 px-10 text-center font-medium text-white hover:bg-opacity-90 lg:px-8 xl:px-10 disabled:bg-body"
          onClick={filterUsers}
        >
          Filter
        </button>
      </div>
      <div className="max-w-full overflow-x-auto">
        <table className="w-full table-auto">
          <thead>
            <tr className="bg-gray-2 text-left dark:bg-meta-4">
              <th className="min-w-[220px] py-4 px-4 font-medium text-black dark:text-white xl:pl-11">
                Contractee Id
              </th>
              <th className="min-w-[220px] py-4 px-4 font-medium text-black dark:text-white xl:pl-11">
                Contractee Name
              </th>
              <th className="min-w-[220px] py-4 px-4 font-medium text-black dark:text-white xl:pl-11">
                Contractee Email
              </th>
              <th className="min-w-[220px] py-4 px-4 font-medium text-black dark:text-white xl:pl-11">
                Contractee Phone
              </th>
              <th className="py-4 px-4 font-medium text-black dark:text-white">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {!isloading &&
              contracts &&
              contracts?.map((u) => (
                <React.Fragment key={u.id}>
                  <tr key={u.id}>
                    <td className="border-b border-[#eee] py-5 px-4 pl-9 dark:border-strokedark xl:pl-11">
                      <h5 className="font-medium text-success">
                        {u.contractId}
                      </h5>
                    </td>
                    <td className="border-b border-[#eee] py-5 px-4 pl-9 dark:border-strokedark xl:pl-11">
                      <h5 className="font-medium text-black dark:text-white">
                        {u.contracteeName}
                      </h5>
                    </td>
                    <td className="border-b border-[#eee] py-5 px-4 pl-9 dark:border-strokedark xl:pl-11">
                      <h5 className="font-medium text-black dark:text-white">
                        {u.contracteeEmail}
                      </h5>
                    </td>
                    <td className="border-b border-[#eee] py-5 px-4 pl-9 dark:border-strokedark xl:pl-11">
                      <h5 className="font-medium text-black dark:text-white">
                        {u.contracteePhoneNo}
                      </h5>
                    </td>
                    <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                      <div
                        className="flex items-center space-x-3.5 hover:text-meta-8 cursor-pointer"
                        onClick={() => {
                          setcontract(u);
                          navigate('/userContractDetails');
                        }}
                      >
                        View Details
                      </div>
                    </td>
                  </tr>
                </React.Fragment>
              ))}
          </tbody>
        </table>
        {isloading && (
          <LoaderIcon className="w-12 h-12 mx-auto my-6" secondary="blue" />
        )}
      </div>
    </div>
  );
};

export default UserContracts;
