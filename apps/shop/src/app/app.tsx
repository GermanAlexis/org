import React, { lazy, Suspense } from 'react';
import ReactDOM from 'react-dom';
import { Route, Routes, Navigate } from 'react-router-dom';
import { LoadingSpinner } from '@org/shop-shared-ui';
import './app.css';
import { createInstance } from '@module-federation/enhanced/runtime';

// Lazy load feature components
const ProductList = lazy(() => import('@org/shop-feature-products').then(m => ({ default: m.ProductList })));
const ProductDetail = lazy(() => import('@org/shop-feature-product-detail').then(m => ({ default: m.ProductDetail })));

// Module Federation runtime instance (pure runtime, no build plugin needed)
const mf = createInstance({
  name: 'host',
  remotes: [
    {
      name: 'remote',
      entry: 'http://localhost:4201/mf-manifest.json',
    },
  ],
  shared: {
    react: {
      version: '19.2.6',
      lib: () => React,
      shareConfig: {
        singleton: true,
        requiredVersion: '^19.2.6',
        eager: false,
      },

    },
    'react-dom': {
      version: '19.2.6',
      lib: () => ReactDOM,
      shareConfig: { eager: false, requiredVersion: '^19.2.6', singleton: true }
    },
  },
});

// Lazy load remote components
const RemoteButton = lazy(() =>
  mf.loadRemote('remote/button').then((r: any) => ({
    default: r.default,
  })),
);
export function App() {



  return (
    <div className="app">
      <header className="app-header">
        <div className="header-content">
          <h1 className="app-title">Nx Shop Demo</h1>
        </div>
      </header>



      <main className="app-main">
        <Suspense fallback={<LoadingSpinner />}>
          <Routes>
            <Route path="/" element={<Navigate to="/products" replace />} />
            <Route path="/products" element={<RemoteButton />} />
            <Route path="/products/:id" element={<ProductDetail />} />
            <Route path="*" element={<Navigate to="/products" replace />} />
          </Routes>
        </Suspense>
      </main>
    </div>
  );
}

export default App;
