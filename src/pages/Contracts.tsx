import React, { useCallback, useEffect, useState } from 'react';
import { LoaderIcon } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { collection, deleteDoc, doc, getDocs } from 'firebase/firestore';
//@ts-ignore
import { db } from '../firebase';
import { toast } from 'react-hot-toast';

import { ref } from 'firebase/database';
import useContract from '../store/useContract';
import useUserAuth from '../store/useUserAuth';
import { useTranslation } from 'react-i18next';
const Contracts = () => {
  const [isloading, setisloading] = useState<boolean>(false);
  const [isdeleting, setisdeleting] = useState<boolean>(false);
  const [reload, setreload] = useState<boolean>(false);
  const [todelete, settodelete] = useState<string>();
  const [showAlert, setshowAlert] = useState(false);
  const [contracts, setcontracts] = useState<Contract[]>([]);
  const { role } = useUserAuth();
  const { t, i18n } = useTranslation();
  const {
    setisEditing,
    addToDb,
    updateIndb,
    setcontract,
    setisNotEditing,
    resetContract,
  } = useContract();
  const navigate = useNavigate();
  const getContracts = useCallback(async () => {
    try {
      setisloading(true);
      const cats = await getDocs(collection(db, 'contracts'));
      const catarray: Contract[] = [];
      if (!cats.empty) {
        cats.forEach((cat) =>
          catarray.push({
            ...(cat.data() as Contract),
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
  useEffect(() => {
    getContracts();
  }, [reload]);
  return (
    <div style={{ direction: i18n.language == 'ar' ? 'rtl' : 'ltr' }}>
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
              {t('Are You Sure You Want To Delete This Item')}
            </h5>
            <ul>
              <li
                className="leading-relaxed text-[#CD5D5D]"
                onClick={async () => {
                  try {
                    setisdeleting(true);
                    console.log(todelete);
                    await deleteDoc(doc(db, 'contracts', todelete!));
                    settodelete('');
                    setshowAlert(false);
                    setreload(true);
                    toast.success('Deleted');
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
      <div
        className={`flex flex-row justify-end my-5 ${
          i18n.language == 'ar' && 'flex-row-reverse'
        } `}
        style={{ direction: i18n.language == 'ar' ? 'rtl' : 'ltr' }}
      >
        {(role?.includes('Contract All') ||
          role?.includes('Contract Create')) && (
          <button
            className="rounded-md inline-flex w-52 items-center justify-center bg-primary py-4 px-10 text-center font-medium text-white hover:bg-opacity-90 lg:px-8 xl:px-10"
            onClick={() => {
              //   setCategoryItems({ image: [], name: '' });
              resetContract();
              setisNotEditing();
              navigate('/addContract');
            }}
          >
            {t('Create')}
          </button>
        )}
      </div>
      <div className="max-w-full overflow-x-auto">
        <table className="w-full table-auto">
          <thead>
            <tr className="bg-gray-2 text-left dark:bg-meta-4">
              <th
                className="min-w-[220px] py-4 px-4 font-medium text-black dark:text-white xl:pl-11"
                style={{ textAlign: i18n.language == 'ar' ? 'right' : 'left' }}
              >
                {t('Contract Title')}
              </th>

              <th
                className="py-4 px-4 font-medium text-black dark:text-white"
                style={{ textAlign: i18n.language == 'ar' ? 'right' : 'left' }}
              >
                {t('Actions')}
              </th>
            </tr>
          </thead>
          <tbody>
            {!isloading &&
              contracts &&
              contracts?.map((u) => (
                <>
                  <tr key={u.id}>
                    <td className="border-b border-[#eee] py-5 px-4 pl-9 dark:border-strokedark xl:pl-11">
                      <h5 className="font-medium text-black dark:text-white">
                        {u.name}
                      </h5>
                    </td>

                    <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                      <div className="flex items-center space-x-3.5">
                        {(role?.includes('Contract All') ||
                          role?.includes('Contract Delete')) && (
                          <button
                            className="hover:text-danger"
                            onClick={() => {
                              setshowAlert((p) => true);
                              settodelete(u.id);
                            }}
                          >
                            <svg
                              className="fill-current"
                              width="18"
                              height="18"
                              viewBox="0 0 18 18"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M13.7535 2.47502H11.5879V1.9969C11.5879 1.15315 10.9129 0.478149 10.0691 0.478149H7.90352C7.05977 0.478149 6.38477 1.15315 6.38477 1.9969V2.47502H4.21914C3.40352 2.47502 2.72852 3.15002 2.72852 3.96565V4.8094C2.72852 5.42815 3.09414 5.9344 3.62852 6.1594L4.07852 15.4688C4.13477 16.6219 5.09102 17.5219 6.24414 17.5219H11.7004C12.8535 17.5219 13.8098 16.6219 13.866 15.4688L14.3441 6.13127C14.8785 5.90627 15.2441 5.3719 15.2441 4.78127V3.93752C15.2441 3.15002 14.5691 2.47502 13.7535 2.47502ZM7.67852 1.9969C7.67852 1.85627 7.79102 1.74377 7.93164 1.74377H10.0973C10.2379 1.74377 10.3504 1.85627 10.3504 1.9969V2.47502H7.70664V1.9969H7.67852ZM4.02227 3.96565C4.02227 3.85315 4.10664 3.74065 4.24727 3.74065H13.7535C13.866 3.74065 13.9785 3.82502 13.9785 3.96565V4.8094C13.9785 4.9219 13.8941 5.0344 13.7535 5.0344H4.24727C4.13477 5.0344 4.02227 4.95002 4.02227 4.8094V3.96565ZM11.7285 16.2563H6.27227C5.79414 16.2563 5.40039 15.8906 5.37227 15.3844L4.95039 6.2719H13.0785L12.6566 15.3844C12.6004 15.8625 12.2066 16.2563 11.7285 16.2563Z"
                                fill=""
                              />
                              <path
                                d="M9.00039 9.11255C8.66289 9.11255 8.35352 9.3938 8.35352 9.75942V13.3313C8.35352 13.6688 8.63477 13.9782 9.00039 13.9782C9.33789 13.9782 9.64727 13.6969 9.64727 13.3313V9.75942C9.64727 9.3938 9.33789 9.11255 9.00039 9.11255Z"
                                fill=""
                              />
                              <path
                                d="M11.2502 9.67504C10.8846 9.64692 10.6033 9.90004 10.5752 10.2657L10.4064 12.7407C10.3783 13.0782 10.6314 13.3875 10.9971 13.4157C11.0252 13.4157 11.0252 13.4157 11.0533 13.4157C11.3908 13.4157 11.6721 13.1625 11.6721 12.825L11.8408 10.35C11.8408 9.98442 11.5877 9.70317 11.2502 9.67504Z"
                                fill=""
                              />
                              <path
                                d="M6.72245 9.67504C6.38495 9.70317 6.1037 10.0125 6.13182 10.35L6.3287 12.825C6.35683 13.1625 6.63808 13.4157 6.94745 13.4157C6.97558 13.4157 6.97558 13.4157 7.0037 13.4157C7.3412 13.3875 7.62245 13.0782 7.59433 12.7407L7.39745 10.2657C7.39745 9.90004 7.08808 9.64692 6.72245 9.67504Z"
                                fill=""
                              />
                            </svg>
                          </button>
                        )}

                        {(role?.includes('Contract All') ||
                          role?.includes('Contract Update')) && (
                          <button
                            className="hover:text-primary"
                            onClick={() => {
                              setisEditing(u.id!);
                              //   setCategoryItems(u);
                              setcontract(u);
                              navigate('/addContract');
                            }}
                          >
                            <svg
                              viewBox="0 0 18 18"
                              height={18}
                              width={18}
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                              className="fill-current"
                            >
                              <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                              <g
                                id="SVGRepo_tracerCarrier"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                              ></g>
                              <g id="SVGRepo_iconCarrier">
                                {' '}
                                <path
                                  d="M20.1497 7.93997L8.27971 19.81C7.21971 20.88 4.04971 21.3699 3.27971 20.6599C2.50971 19.9499 3.06969 16.78 4.12969 15.71L15.9997 3.84C16.5478 3.31801 17.2783 3.03097 18.0351 3.04019C18.7919 3.04942 19.5151 3.35418 20.0503 3.88938C20.5855 4.42457 20.8903 5.14781 20.8995 5.90463C20.9088 6.66146 20.6217 7.39189 20.0997 7.93997H20.1497Z"
                                  stroke="#000000"
                                  stroke-width="1.5"
                                  stroke-linecap="round"
                                  stroke-linejoin="round"
                                ></path>{' '}
                                <path
                                  d="M21 21H12"
                                  stroke="#000000"
                                  stroke-width="1.5"
                                  stroke-linecap="round"
                                  stroke-linejoin="round"
                                ></path>{' '}
                              </g>
                            </svg>
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                </>
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

export default Contracts;
