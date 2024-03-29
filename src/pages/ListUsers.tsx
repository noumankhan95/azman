import { useCallback, useState, lazy } from 'react';
const NewUsers = lazy(() => import('./NewUsers'));
const ApprovedUsers = lazy(() => import('./ApprovedUsers'));

type ListModes = 'Pending' | 'Approved';
function ListUsers() {
  const [mode, setmode] = useState<ListModes>('Pending');

  return (
    <div className="">
      <div className="space-x-6 text-start">
        <button
          className="!p-3 inline-flex items-center rounded-md justify-center bg-primary  text-center font-medium text-white hover:bg-opacity-90 lg:px-8 xl:px-10"
          onClick={setmode.bind(null, 'Pending')}
        >
          New Users
        </button>
        <button
          className="!p-3 inline-flex items-center rounded-md justify-center bg-primary  text-center font-medium text-white hover:bg-opacity-90 lg:px-8 xl:px-10"
          onClick={setmode.bind(null, 'Approved')}
        >
          Approved Users
        </button>
      </div>
      {mode === 'Approved' ? <ApprovedUsers /> : <NewUsers />}
    </div>
  );
}

export default ListUsers;
