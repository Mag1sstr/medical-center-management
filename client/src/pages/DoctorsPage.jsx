import { useState } from 'react';
import { useGetDoctorsQuery, useAddDoctorMutation } from '../store/api';

export default function DoctorsPage() {
  const { data = [], isLoading, isError, error } = useGetDoctorsQuery();
  const [addDoctor, { isLoading: isAdding }] = useAddDoctorMutation();
  const [fullName, setFullName] = useState('');
  const [specialty, setSpecialty] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    if (!fullName.trim() || !specialty.trim()) return;
    try {
      await addDoctor({
        full_name: fullName.trim(),
        specialty: specialty.trim(),
      }).unwrap();
      setFullName('');
      setSpecialty('');
    } catch (_) {
      alert('Не удалось сохранить врача');
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-clinic-900">Врачи</h1>
        <p className="mt-1 text-sm text-slate-600">Список и добавление врачей</p>
      </div>

      <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-lg font-semibold text-slate-800">Добавить врача</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-end">
          <div className="min-w-[200px] flex-1">
            <label className="mb-1 block text-xs font-medium text-slate-600">ФИО</label>
            <input
              className="w-full rounded border border-slate-300 px-3 py-2 text-sm focus:border-clinic-600 focus:outline-none focus:ring-1 focus:ring-clinic-600"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Петрова Анна Сергеевна"
              required
            />
          </div>
          <div className="min-w-[200px] flex-1">
            <label className="mb-1 block text-xs font-medium text-slate-600">Специальность</label>
            <input
              className="w-full rounded border border-slate-300 px-3 py-2 text-sm focus:border-clinic-600 focus:outline-none focus:ring-1 focus:ring-clinic-600"
              value={specialty}
              onChange={(e) => setSpecialty(e.target.value)}
              placeholder="Терапевт"
              required
            />
          </div>
          <button
            type="submit"
            disabled={isAdding}
            className="rounded bg-clinic-800 px-4 py-2 text-sm font-medium text-white hover:bg-clinic-900 disabled:opacity-50"
          >
            Добавить
          </button>
        </form>
      </section>

      <section className="rounded-lg border border-slate-200 bg-white shadow-sm overflow-hidden">
        <h2 className="border-b border-slate-100 bg-slate-50 px-4 py-3 text-lg font-semibold text-slate-800">
          Список врачей
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
                  <th className="px-4 py-2 font-medium">ФИО</th>
                  <th className="px-4 py-2 font-medium">Специальность</th>
                </tr>
              </thead>
              <tbody>
                {data.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="px-4 py-6 text-center text-slate-500">
                      Нет записей
                    </td>
                  </tr>
                ) : (
                  data.map((d) => (
                    <tr key={d.doctor_id} className="border-t border-slate-100 hover:bg-slate-50">
                      <td className="px-4 py-2">{d.doctor_id}</td>
                      <td className="px-4 py-2">{d.full_name}</td>
                      <td className="px-4 py-2">{d.specialty}</td>
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
