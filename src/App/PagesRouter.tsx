import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { App } from './App';
import { DataEditorPage } from './DataEditorPage';
import { editorDataPage } from './routes';

export const PagesRouter = () => (
  <Routes>
    <Route element={<App />}>
      <Route path={`${editorDataPage}/*`} element={<DataEditorPage />} />
      <Route path="*" element={<Navigate to={editorDataPage} />} />
    </Route>
  </Routes>
);
