import React from 'react';
import ReactDOM from 'react-dom/client';
import 'bootstrap/dist/css/bootstrap.css';
import './index.css';
import reportWebVitals from './reportWebVitals';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import StartSurvey from './app/[surveyId]/start/page';
import SelectProfile from './app/[surveyId]/selectProfile/page';
import AnswerSurvey from './app/[surveyId]/answer/page';
import FinishSurvey from './app/[surveyId]/finish/page';

const router = createBrowserRouter([
  {
    path: "/:surveyId/start",
    Component: StartSurvey
  },
  {
    path: "/:surveyId/selectProfile",
    Component: SelectProfile
  },
  {
    path: "/:surveyId/answer",
    Component: AnswerSurvey
  },
  {
    path: "/:surveyId/finish",
    Component: FinishSurvey
  },
]);

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
      <RouterProvider router={router} />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
