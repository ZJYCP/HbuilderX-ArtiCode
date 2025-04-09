import React, { Suspense, useEffect } from 'react';
import { HashRouter, Routes, Route } from 'react-router';
import Layout from './components/layout';
import { useSystemStore } from './store';
import useSendMessage from './hooks/useSendMessage';
import { ExtMessageType } from '../utils/extType';
import { useRequest } from 'ahooks';
import { useCheckNewRelease } from './hooks/useCheckNewRelease';

const SignIn = React.lazy(() => import('./pages/signIn'));
const SignUp = React.lazy(() => import('./pages/signUp'));
const Home = React.lazy(() => import('./pages/home'));
export default function App() {
  const { systemInfo } = useSystemStore();
  const { sendHandler } = useSendMessage();

  useEffect(() => {
    setTimeout(() => {
      sendHandler({
        type: ExtMessageType.OPENED,
        data: {},
      });
    }, 400);
  }, []);

  /** 检查前端是否有新版本 */
  useCheckNewRelease();

  return (
    <HashRouter>
      <main className={`${systemInfo.theme} text-foreground bg-background`}>
        <Suspense fallback={<div>Loading...</div>}>
          <Layout>
            <Routes>
              <Route path="/signin" element={<SignIn />}></Route>
              <Route path="/signup" element={<SignUp />}></Route>
              <Route path="/" element={<Home />}></Route>
            </Routes>
          </Layout>
        </Suspense>
      </main>
    </HashRouter>
  );
}
