/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import Landing from './pages/Landing';
import Diagnostic from './pages/Diagnostic';

function ScrollToTop() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (!hash) {
      window.scrollTo(0, 0);
      return;
    }
    // The target heading does not exist when the browser handles the hash on a cold
    // load, so scroll it into view once React has rendered it.
    const id = decodeURIComponent(hash.slice(1));
    let frame = 0;
    const tryScroll = () => {
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView();
      } else if (frame++ < 60) {
        requestAnimationFrame(tryScroll);
      }
    };
    tryScroll();
  }, [pathname, hash]);
  return null;
}

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/diagnostic" element={<Diagnostic />} />
      </Routes>
    </BrowserRouter>
  );
}
