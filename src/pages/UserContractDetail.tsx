//@ts-ignore
import { db } from '../firebase.js';

import { Fragment } from 'react';

import useUserContract from '../store/useUserContract.js';
//@ts-ignore
import html2pdf from 'html2pdf.js';
import { toast } from 'react-toastify';
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
  return (
    <div>
      <h1 className="text-4xl text-black dark:text-white">
        User Contract Details
      </h1>
      <button onClick={handleGetText} className="underline my-10 text-meta-5">
        Download Contract
      </button>
      <div className="flex flex-col gap-5.5 p-6.5">
        <div className="flex flex-col md:flex-row items-center space-x-0 md:space-x-4 justify-start">
          <div className="w-full md:w-2/5">
            <h1 className="mb-3 block text-black dark:text-bodydark">
              Contractee Name
            </h1>
            <h2 className="mb-3 block text-black dark:text-white">
              {contract.contracteeName}
            </h2>
          </div>
          <div className="w-full md:w-2/5">
            <h1 className="mb-3 block text-black dark:text-bodydark">
              Contractee Email
            </h1>
            <h2 className="mb-3 block text-black dark:text-white">
              {contract.contracteeEmail}
            </h2>
          </div>
          <div className="w-full md:w-2/5">
            <h1 className="mb-3 block text-black dark:text-bodydark">
              Contractee Date
            </h1>
            <h2 className="mb-3 block text-black dark:text-white">
              {contract.contracteeDate}
            </h2>
          </div>
        </div>
        <h1 className="text-2xl">Base Contract Details</h1>
        <div className="flex flex-col md:flex-row items-center space-x-0 md:space-x-4 justify-start">
          <div className="w-full md:w-2/5">
            <h1 className="mb-3 block text-black dark:text-bodydark">
              Base Contract Title
            </h1>
            <h1 className="mb-3 block text-black dark:text-white">
              {contract?.baseContractTitle}
            </h1>
          </div>
          <div className="w-full md:w-2/5">
            <h1 className="mb-3 block text-black dark:text-bodydark">
              Base Contract Type
            </h1>
            <h1 className="mb-3 block text-black dark:text-white">
              {contract?.baseContractType}
            </h1>
          </div>
          <div className="w-full md:w-2/5">
            <h1 className="mb-3 block text-black dark:text-bodydark">
              Base Contract StartDate
            </h1>
            <h1 className="mb-3 block text-black dark:text-white">
              {contract?.baseContractStartDate}
            </h1>
          </div>
        </div>
        <div className="flex flex-col md:flex-row items-center space-x-0 md:space-x-4 justify-start">
          <div className="w-full md:w-2/5">
            <h1 className="mb-3 block text-black dark:text-bodydark">
              Contractee Number
            </h1>
            <h2 className="mb-3 block text-black dark:text-white">
              {contract?.contracteePhoneNo}
            </h2>
          </div>
          <div className="w-full md:w-2/5">
            <h1 className="mb-3 block text-black dark:text-bodydark">
              Contractee Membership Id
            </h1>
            <h2 className="mb-3 block text-black dark:text-white">
              {contract?.contracteeMembershipID}
            </h2>
          </div>
          <div className="w-full md:w-2/5">
            <h1 className="mb-3 block text-black dark:text-bodydark">
              ContracteeCnic
            </h1>
            <h2 className="mb-3 block text-black dark:text-white">
              {contract?.contracteeCnic}
            </h2>
          </div>
        </div>
        <div className="flex flex-col md:flex-row items-center space-x-0 md:space-x-4 justify-start">
          <div className="w-full md:w-2/5">
            <h1 className="mb-3 block text-black dark:text-bodydark">
              Contractor Duration
            </h1>
            <h1 className="mb-3 block text-black dark:text-white">
              {contract?.contractorDuration}
            </h1>
          </div>
          <div className="w-full md:w-2/5">
            <h1 className="mb-3 block text-black dark:text-bodydark">
              Contractor Amount
            </h1>
            <h1 className="mb-3 block text-black dark:text-white">
              {contract?.contractorAmount}
            </h1>
          </div>
          <div className="w-full md:w-2/5">
            <h1 className="mb-3 block text-black dark:text-bodydark">
              Contractor Date
            </h1>
            <h1 className="mb-3 block text-black dark:text-white">
              {contract?.contractorDate}
            </h1>
          </div>
        </div>
        <h1 className="text-3xl font-serif">Contractor Details</h1>
        <div className="flex flex-col md:flex-row items-center space-x-0 md:space-x-4 justify-start">
          <div className="w-full md:w-2/5">
            <h1 className="mb-3 block text-black dark:text-bodydark">
              Contractor Name
            </h1>
            <h1 className="mb-3 block text-black dark:text-white">
              {contract?.contractorName}
            </h1>
          </div>
          <div className="w-full md:w-2/5">
            <h1 className="mb-3 block text-black dark:text-bodydark">
              Contractor Phone
            </h1>
            <h1 className="mb-3 block text-black dark:text-white">
              {contract?.contractorPhoneNo}
            </h1>
          </div>
          <div className="w-full md:w-2/5">
            <h1 className="mb-3 block text-black dark:text-bodydark">
              Contractor Cnic
            </h1>
            <h1 className="mb-3 block text-black dark:text-white">
              {contract?.contractorCnic}
            </h1>
          </div>
        </div>
        {contract?.installments?.length > 0 && (
          <h1 className="text-3xl font-serif">Installments</h1>
        )}
        {contract.installments?.map((i, ind) => (
          <div key={i.date} className="ml-10">
            <span className="text-2xl">No. {ind + 1}</span>
            <div className="flex flex-col md:flex-row items-center space-x-0 md:space-x-4 justify-start">
              <div className="w-full md:w-2/5">
                <h1 className="mb-3 block text-black dark:text-bodydark">
                  Installment Amount
                </h1>
                <h1 className="mb-3 block text-black dark:text-white">
                  {i.amount}
                </h1>
              </div>
              <div className="w-full md:w-2/5">
                <h1 className="mb-3 block text-black dark:text-bodydark">
                  Installment Remaining Amount
                </h1>
                <h1 className="mb-3 block text-black dark:text-white">
                  {i.remainingAmount}
                </h1>
              </div>
              <div className="w-full md:w-2/5">
                <h1 className="mb-3 block text-black dark:text-bodydark">
                  Installment Status
                </h1>
                <h1 className="mb-3 block text-black dark:text-white">
                  {i.status}
                </h1>
              </div>
            </div>
            <div className="flex flex-col md:flex-row items-center space-x-0 md:space-x-4 justify-start">
              <div className="w-full md:w-2/5">
                <h1 className="mb-3 block text-black dark:text-bodydark">
                  Installment Description
                </h1>
                <h1 className="mb-3 block text-black dark:text-white">
                  {i.description}
                </h1>
              </div>
            </div>
            <div className="flex flex-col md:flex-row items-center space-x-0 md:space-x-4 justify-start">
              <div className="w-full md:w-2/5">
                <h1 className="mb-3 block text-black dark:text-bodydark">
                  Operation Type
                </h1>
                <h1 className="mb-3 block text-black dark:text-white">
                  {i.operationtype}
                </h1>
              </div>
            </div>
            <div className="flex flex-col md:flex-row items-center space-x-0 md:space-x-4 justify-start">
              <div className="w-full md:w-2/5">
                <h1 className="mb-3 block text-black dark:text-bodydark">
                  Operation Status
                </h1>
                <h1 className="mb-3 block text-black dark:text-white">
                  {i.status}
                </h1>
              </div>
            </div>
            <hr />
          </div>
        ))}

        <h1 className="text-2xl">Questions</h1>
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
