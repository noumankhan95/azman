import { Suspense, lazy, useEffect, useState } from 'react';
import { Route, Routes } from 'react-router-dom';
// import { Toaster } from 'react-hot-toast';
import { ToastContainer } from 'react-toastify';
import ECommerce from './pages/Dashboard/ECommerce';
import SignIn from './pages/Authentication/SignIn';
import SignUp from './pages/Authentication/SignUp';
import 'react-toastify/dist/ReactToastify.css';
import 'react-quill/dist/quill.snow.css';
import Loader from './common/Loader';
import routes from './routes';
// @ts-ignore
import { db, auth } from './firebase';
import { onAuthStateChanged } from 'firebase/auth';
import useUserAuth from './store/useUserAuth';
import { doc, getDoc } from 'firebase/firestore';
import Tables from './pages/Tables';
import ListUsers from './pages/ListUsers';
const DefaultLayout = lazy(() => import('./layout/DefaultLayout'));

function App() {
  const [loading, setLoading] = useState<boolean>(true);
  const { isloggedIn, setisloggedIn, ...u } = useUserAuth();
  useEffect(() => {
    setLoading((p) => true);
    const sub = onAuthStateChanged(auth, (user) => {
      if (user) {
        getDoc(doc(db, 'users', user.uid))
          .then((u) => {
            console.log(u?.data()?.permissions, 'per');
            setisloggedIn({
              ...u?.data(),
              uid: user.uid,
              isloggedIn: true,
              cnic: u.data()?.cnic,
              email: u.data()?.email,
              name: u.data()?.email,
              phoneNo: u.data()?.phoneNo,
            } as UserAuth);
          })
          .catch((e) => {
            alert(e);
          })
          .finally(() => {
            setLoading(false);
          });
      } else {
        setisloggedIn({
          email: '',
          uid: '',
          name: '',
          phoneNo: '',
          isloggedIn: false,
          cnic: '',
          aldolat: '',
          almadina: '',
          almontaqatha: '',
          approval: '',
          date: '',
          status: '',
          role: 'Admin',
        });
        setLoading(false);
      }
    });
    return () => sub();
  }, []);
  // useEffect(() => {
  //   setTimeout(() => setLoading(false), 1000);
  //   //For timeout
  // }, []);
  // console.log('loading', loading);

  console.log('islogged Auth', isloggedIn, 'and ', u);
  return loading ? (
    <Loader />
  ) : (
    <>
      <ToastContainer position="top-right" />
      <Suspense fallback={<Loader />}>
        <Routes>
          {!isloggedIn && !loading ? (
            <>
              <Route path="/auth/signin" element={<SignIn />} />
              {/* <Route path="/auth/signup" element={<SignUp />} /> */}
              <Route path="*" element={<SignUp />} />
            </>
          ) : (
            <Route element={<DefaultLayout />}>
              <Route index element={<ListUsers />} />
              {routes.map((routes, index) => {
                const { path, component: Component } = routes;
                return (
                  <Route key={index} path={path} element={<Component />} />
                );
              })}
              <Route path="*" element={<ListUsers />} />
            </Route>
          )}
        </Routes>
      </Suspense>
    </>
  );
}

export default App;
