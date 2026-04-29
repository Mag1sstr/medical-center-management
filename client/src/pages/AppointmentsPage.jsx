import { useState } from 'react';
import {
  useGetAppointmentsQuery,
  useAddAppointmentMutation,
  useGetPatientsQuery,
  useGetDoctorsQuery,
} from '../store/api';

function toIsoFromLocal(datetimeLocal) {
  if (!datetimeLocal) return '';
  const d = new Date(datetimeLocal);
  return Number.isNaN(d.getTime()) ? datetimeLocal : d.toISOString();
}

export default function AppointmentsPage() {
  const { data: appointments = [], isLoading, isError, error } = useGetAppointmentsQuery();
  const { data: patients = [] } = useGetPatientsQuery();
  const { data: doctors = [] } = useGetDoctorsQuery();
  const [addAppointment, { isLoading: isAdding }] = useAddAppointmentMutation();

  const [patientId, setPatientId] = useState('');
  const [doctorId, setDoctorId] = useState('');
  const [visitDate, setVisitDate] = useState('');
  const [diagnosis, setDiagnosis] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    const pid = Number(patientId);
    const did = Number(doctorId);
    if (!pid || !did || !visitDate) return;
    try {
      await addAppointment({
        patient_id: pid,
        doctor_id: did,
        visit_date: toIsoFromLocal(visitDate),
        diagnosis: diagnosis.trim() || null,
      }).unwrap();
      setPatientId('');
      setDoctorId('');
      setVisitDate('');
      setDiagnosis('');
    } catch (_) {
      alert('Не удалось сохранить приём (проверьте ID пациента и врача)');
    }
  }

  const patientMap = Object.fromEntries(patients.map((p) => [p.patient_id, p.full_name]));
  const doctorMap = Object.fromEntries(doctors.map((d) => [d.doctor_id, d.full_name]));

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-clinic-900">Приёмы</h1>
        <p className="mt-1 text-sm text-slate-600">Запись на приём и список визитов</p>
      </div>

      <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-lg font-semibold text-slate-800">Добавить приём</h2>
        <form onSubmit={handleSubmit} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-600">Пациент</label>
            <select
              className="w-full rounded border border-slate-300 px-3 py-2 text-sm focus:border-clinic-600 focus:outline-none focus:ring-1 focus:ring-clinic-600"
              value={patientId}
              onChange={(e) => setPatientId(e.target.value)}
              required
            >
              <option value="">Выберите пациента</option>
              {patients.map((p) => (
                <option key={p.patient_id} value={p.patient_id}>
                  #{p.patient_id} — {p.full_name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-600">Врач</label>
            <select
              className="w-full rounded border border-slate-300 px-3 py-2 text-sm focus:border-clinic-600 focus:outline-none focus:ring-1 focus:ring-clinic-600"
              value={doctorId}
              onChange={(e) => setDoctorId(e.target.value)}
              required
            >
              <option value="">Выберите врача</option>
              {doctors.map((d) => (
                <option key={d.doctor_id} value={d.doctor_id}>
                  #{d.doctor_id} — {d.full_name} ({d.specialty})
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-600">Дата и время</label>
            <input
              type="datetime-local"
              className="w-full rounded border border-slate-300 px-3 py-2 text-sm focus:border-clinic-600 focus:outline-none focus:ring-1 focus:ring-clinic-600"
              value={visitDate}
              onChange={(e) => setVisitDate(e.target.value)}
              required
            />
          </div>
          <div className="sm:col-span-2">
            <label className="mb-1 block text-xs font-medium text-slate-600">Диагноз</label>
            <input
              className="w-full rounded border border-slate-300 px-3 py-2 text-sm focus:border-clinic-600 focus:outline-none focus:ring-1 focus:ring-clinic-600"
              value={diagnosis}
              onChange={(e) => setDiagnosis(e.target.value)}
              placeholder="ОРВИ"
            />
          </div>
          <div className="flex items-end">
            <button
              type="submit"
              disabled={isAdding || patients.length === 0 || doctors.length === 0}
              className="rounded bg-clinic-800 px-4 py-2 text-sm font-medium text-white hover:bg-clinic-900 disabled:opacity-50"
            >
              Добавить
            </button>
          </div>
        </form>
        {(patients.length === 0 || doctors.length === 0) && (
          <p className="mt-3 text-sm text-amber-700">
            Сначала добавьте хотя бы одного пациента и одного врача на соответствующих страницах.
          </p>
        )}
      </section>

      <section className="rounded-lg border border-slate-200 bg-white shadow-sm overflow-hidden">
        <h2 className="border-b border-slate-100 bg-slate-50 px-4 py-3 text-lg font-semibold text-slate-800">
          Список приёмов
        </h2>
        {isLoading && <p className="p-4 text-sm text-slate-500">Загрузка…</p>}
        {isError && (
          <p className="p-4 text-sm text-red-600">
            Ошибка загрузки: {error?.data?.error || error?.message || 'сеть'}
          </p>
        )}
        {!isLoading && !isError && (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-100 text-slate-700">
                <tr>
                  <th className="px-4 py-2 font-medium">ID</th>
                  <th className="px-4 py-2 font-medium">Дата</th>
                  <th className="px-4 py-2 font-medium">Пациент</th>
                  <th className="px-4 py-2 font-medium">Врач</th>
                  <th className="px-4 py-2 font-medium">Диагноз</th>
                </tr>
              </thead>
              <tbody>
                {appointments.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-4 py-6 text-center text-slate-500">
                      Нет записей
                    </td>
                  </tr>
                ) : (
                  appointments.map((a) => (
                    <tr key={a.appointment_id} className="border-t border-slate-100 hover:bg-slate-50">
                      <td className="px-4 py-2">{a.appointment_id}</td>
                      <td className="px-4 py-2 whitespace-nowrap">
                        {a.visit_date && new Date(a.visit_date).toLocaleString('ru-RU')}
                      </td>
                      <td className="px-4 py-2">{patientMap[a.patient_id] ?? `#${a.patient_id}`}</td>
                      <td className="px-4 py-2">{doctorMap[a.doctor_id] ?? `#${a.doctor_id}`}</td>
                      <td className="px-4 py-2">{a.diagnosis ?? '—'}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
