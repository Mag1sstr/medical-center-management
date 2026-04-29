import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const raw = import.meta.env.VITE_API_URL;
const baseUrl = raw === undefined || raw === '' ? '' : raw.replace(/\/$/, '');

export const api = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({ baseUrl }),
  tagTypes: ['Patient', 'Doctor', 'Appointment', 'Treatment', 'Analytics'],
  endpoints: (builder) => ({
    getPatients: builder.query({
      query: () => '/patients',
      providesTags: ['Patient'],
    }),
    addPatient: builder.mutation({
      query: (body) => ({ url: '/patients', method: 'POST', body }),
      invalidatesTags: ['Patient', 'Analytics'],
    }),
    getDoctors: builder.query({
      query: () => '/doctors',
      providesTags: ['Doctor'],
    }),
    addDoctor: builder.mutation({
      query: (body) => ({ url: '/doctors', method: 'POST', body }),
      invalidatesTags: ['Doctor', 'Analytics'],
    }),
    getAppointments: builder.query({
      query: () => '/appointments',
      providesTags: ['Appointment'],
    }),
    addAppointment: builder.mutation({
      query: (body) => ({ url: '/appointments', method: 'POST', body }),
      invalidatesTags: ['Appointment', 'Analytics'],
    }),
    getTreatments: builder.query({
      query: () => '/treatments',
      providesTags: ['Treatment'],
    }),
    addTreatment: builder.mutation({
      query: (body) => ({ url: '/treatments', method: 'POST', body }),
      invalidatesTags: ['Treatment', 'Analytics'],
    }),
    getAnalyticsAppointments: builder.query({
      query: () => '/analytics/appointments',
      providesTags: ['Analytics'],
    }),
    getDoctorLoad: builder.query({
      query: () => '/analytics/doctor-load',
      providesTags: ['Analytics'],
    }),
    getTotalIncome: builder.query({
      query: () => '/analytics/total-income',
      providesTags: ['Analytics'],
    }),
    getIncomeByDoctor: builder.query({
      query: () => '/analytics/income-by-doctor',
      providesTags: ['Analytics'],
    }),
    getDiagnosisStats: builder.query({
      query: () => '/analytics/diagnosis-stats',
      providesTags: ['Analytics'],
    }),
  }),
});

export const {
  useGetPatientsQuery,
  useAddPatientMutation,
  useGetDoctorsQuery,
  useAddDoctorMutation,
  useGetAppointmentsQuery,
  useAddAppointmentMutation,
  useGetTreatmentsQuery,
  useAddTreatmentMutation,
  useGetAnalyticsAppointmentsQuery,
  useGetDoctorLoadQuery,
  useGetTotalIncomeQuery,
  useGetIncomeByDoctorQuery,
  useGetDiagnosisStatsQuery,
} = api;
