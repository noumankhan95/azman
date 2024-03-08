//@ts-ignore
import { db } from '../firebase.js';

import { Fragment } from 'react';

import useUserContract from '../store/useUserContract.js';
//@ts-ignore
import html2pdf from 'html2pdf.js';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';
function UserContractDetails() {
  const { contract } = useUserContract();
  console.log(contract);
  const handleGetText = () => {
    if (!contract.contractHTML)
      return toast.error('Contract Doesnt Have Data To Download');
    const options = {
      filename: 'my-document.pdf',
      margin: 10, // Adjust the margin to give some space at the edges
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 1 }, // Adjust the scale factor
      jsPDF: {
        unit: 'mm', // Change the unit to millimeters
        format: 'a4',
        orientation: 'portrait',
      },
      pagebreak: { mode: 'avoid-all' },
    };
    html2pdf()
      .set(options)
      .from(contract.contractHTML)
      .output('dataurlnewwindow', {
        // Output PDF directly with custom margins
        margin: { top: 20, right: 10, bottom: 20, left: 10 }, // Adjust individual margins
      });
  };
  const { t, i18n } = useTranslation();
  return (
    <div>
      <h1
        className="text-4xl text-black dark:text-white"
        style={{ direction: i18n.language == 'ar' ? 'rtl' : 'ltr' }}
      >
        {t('User Contract Details')}
      </h1>
      <div style={{ direction: i18n.language == 'ar' ? 'rtl' : 'ltr' }}>
        <button onClick={handleGetText} className="underline my-10 text-meta-5">
          {t('Download Contract')}
        </button>
      </div>

      <div
        className="flex flex-col gap-5.5 p-6.5"
        style={{ direction: i18n.language == 'ar' ? 'rtl' : 'ltr' }}
      >
        <div className="flex flex-col md:flex-row items-center space-x-0 md:space-x-4 justify-start">
          <div className="w-full md:w-2/5">
            <h1 className="mb-3 block text-black dark:text-bodydark">
              {t('Contractee Name')}
            </h1>
            <h2 className="mb-3 block text-black dark:text-white">
              {contract.contracteeName}
            </h2>
          </div>
          <div className="w-full md:w-2/5">
            <h1 className="mb-3 block text-black dark:text-bodydark">
              {t('Contractee Email')}
            </h1>
            <h2 className="mb-3 block text-black dark:text-white">
              {contract.contracteeEmail}
            </h2>
          </div>
          <div className="w-full md:w-2/5">
            <h1 className="mb-3 block text-black dark:text-bodydark">
              {t('Contractee Date')}
            </h1>
            <h2 className="mb-3 block text-black dark:text-white">
              {contract.contracteeDate}
            </h2>
          </div>
        </div>
        <h1 className="text-2xl">{t('Base Contract Details')}</h1>
        <div className="flex flex-col md:flex-row items-center space-x-0 md:space-x-4 justify-start">
          <div className="w-full md:w-2/5">
            <h1 className="mb-3 block text-black dark:text-bodydark">
              {t('Base Contract Title')}
            </h1>
            <h1 className="mb-3 block text-black dark:text-white">
              {contract?.baseContractTitle}
            </h1>
          </div>
          <div className="w-full md:w-2/5">
            <h1 className="mb-3 block text-black dark:text-bodydark">
              {t('Base Contract Type')}
            </h1>
            <h1 className="mb-3 block text-black dark:text-white">
              {contract?.baseContractType}
            </h1>
          </div>
          <div className="w-full md:w-2/5">
            <h1 className="mb-3 block text-black dark:text-bodydark">
              {t('Base Contract StartDate')}
            </h1>
            <h1 className="mb-3 block text-black dark:text-white">
              {contract?.baseContractStartDate}
            </h1>
          </div>
        </div>
        <div className="flex flex-col md:flex-row items-center space-x-0 md:space-x-4 justify-start">
          <div className="w-full md:w-2/5">
            <h1 className="mb-3 block text-black dark:text-bodydark">
              {t('Contractee Number')}
            </h1>
            <h2 className="mb-3 block text-black dark:text-white">
              {contract?.contracteePhoneNo}
            </h2>
          </div>
          <div className="w-full md:w-2/5">
            <h1 className="mb-3 block text-black dark:text-bodydark">
              {t('Contractee Membership Id')}
            </h1>
            <h2 className="mb-3 block text-black dark:text-white">
              {contract?.contracteeMembershipID}
            </h2>
          </div>
          <div className="w-full md:w-2/5">
            <h1 className="mb-3 block text-black dark:text-bodydark">
              {t('ContracteeCnic')}
            </h1>
            <h2 className="mb-3 block text-black dark:text-white">
              {contract?.contracteeCnic}
            </h2>
          </div>
        </div>
        <div className="flex flex-col md:flex-row items-center space-x-0 md:space-x-4 justify-start">
          <div className="w-full md:w-2/5">
            <h1 className="mb-3 block text-black dark:text-bodydark">
              {t('Contractor Duration')}
            </h1>
            <h1 className="mb-3 block text-black dark:text-white">
              {contract?.contractorDuration}
            </h1>
          </div>
          <div className="w-full md:w-2/5">
            <h1 className="mb-3 block text-black dark:text-bodydark">
              {t('Contractor Amount')}
            </h1>
            <h1 className="mb-3 block text-black dark:text-white">
              {contract?.contractorAmount}
            </h1>
          </div>
          <div className="w-full md:w-2/5">
            <h1 className="mb-3 block text-black dark:text-bodydark">
              {t('Contractor Date')}
            </h1>
            <h1 className="mb-3 block text-black dark:text-white">
              {contract?.contractorDate}
            </h1>
          </div>
        </div>
        <h1 className="text-3xl font-serif">{t('Contractor Details')}</h1>
        <div className="flex flex-col md:flex-row items-center space-x-0 md:space-x-4 justify-start">
          <div className="w-full md:w-2/5">
            <h1 className="mb-3 block text-black dark:text-bodydark">
              {t('Contractor Name')}
            </h1>
            <h1 className="mb-3 block text-black dark:text-white">
              {contract?.contractorName}
            </h1>
          </div>
          <div className="w-full md:w-2/5">
            <h1 className="mb-3 block text-black dark:text-bodydark">
              {t('Contractor Phone')}
            </h1>
            <h1 className="mb-3 block text-black dark:text-white">
              {contract?.contractorPhoneNo}
            </h1>
          </div>
          <div className="w-full md:w-2/5">
            <h1 className="mb-3 block text-black dark:text-bodydark">
              {t('Contractor Cnic')}
            </h1>
            <h1 className="mb-3 block text-black dark:text-white">
              {contract?.contractorCnic}
            </h1>
          </div>
        </div>
        {contract?.installments?.length > 0 && (
          <h1 className="text-3xl font-serif">{t('Installments')}</h1>
        )}
        {contract.installments?.map((i, ind) => (
          <div key={i.date} className="ml-10">
            <span className="text-2xl">No. {ind + 1}</span>
            <div className="flex flex-col md:flex-row items-center space-x-0 md:space-x-4 justify-start">
              <div className="w-full md:w-2/5">
                <h1 className="mb-3 block text-black dark:text-bodydark">
                  {t('Installment Amount')}
                </h1>
                <h1 className="mb-3 block text-black dark:text-white">
                  {i.amount}
                </h1>
              </div>
              <div className="w-full md:w-2/5">
                <h1 className="mb-3 block text-black dark:text-bodydark">
                  {t('Installment Remaining Amount')}
                </h1>
                <h1 className="mb-3 block text-black dark:text-white">
                  {i.remainingAmount}
                </h1>
              </div>
              <div className="w-full md:w-2/5">
                <h1 className="mb-3 block text-black dark:text-bodydark">
                  {t('Installment Status')}
                </h1>
                <h1 className="mb-3 block text-black dark:text-white">
                  {i.status}
                </h1>
              </div>
            </div>
            <div className="flex flex-col md:flex-row items-center space-x-0 md:space-x-4 justify-start">
              <div className="w-full md:w-2/5">
                <h1 className="mb-3 block text-black dark:text-bodydark">
                  {t('Installment Description')}
                </h1>
                <h1 className="mb-3 block text-black dark:text-white">
                  {i.description}
                </h1>
              </div>
            </div>
            <div className="flex flex-col md:flex-row items-center space-x-0 md:space-x-4 justify-start">
              <div className="w-full md:w-2/5">
                <h1 className="mb-3 block text-black dark:text-bodydark">
                  {t('Operation Type')}
                </h1>
                <h1 className="mb-3 block text-black dark:text-white">
                  {i.operationtype}
                </h1>
              </div>
            </div>
            <div className="flex flex-col md:flex-row items-center space-x-0 md:space-x-4 justify-start">
              <div className="w-full md:w-2/5">
                <h1 className="mb-3 block text-black dark:text-bodydark">
                  {t('Operation Status')}
                </h1>
                <h1 className="mb-3 block text-black dark:text-white">
                  {i.status}
                </h1>
              </div>
            </div>
            <hr />
          </div>
        ))}

        <h1 className="text-2xl">{t('Questions')}</h1>
        {contract?.questions?.map((q, ind) => (
          <div key={q.question.slice(0, -4)}>
            <p>
              {ind + 1}. {q.question}
            </p>
            <p>{q.answer}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default UserContractDetails;

// Example usage
