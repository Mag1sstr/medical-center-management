import { useState } from "react";
import { useGetPatientsQuery, useAddPatientMutation } from "../store/api";

export default function PatientsPage() {
  const { data = [], isLoading, isError, error } = useGetPatientsQuery();
  const [addPatient, { isLoading: isAdding }] = useAddPatientMutation();
  const [fullName, setFullName] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [gender, setGender] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    if (!fullName.trim() || !birthDate || !gender) return;
    try {
      await addPatient({
        full_name: fullName.trim(),
        birth_date: birthDate,
        gender,
      }).unwrap();
      setFullName("");
      setBirthDate("");
      setGender("");
    } catch (_) {
      alert("Не удалось сохранить пациента");
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-clinic-900">Пациенты</h1>
        <p className="mt-1 text-sm text-slate-600">
          Список и регистрация пациентов
        </p>
      </div>

      <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-lg font-semibold text-slate-800">
          Добавить пациента
        </h2>
        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-end"
        >
          <div className="min-w-[200px] flex-1">
            <label className="mb-1 block text-xs font-medium text-slate-600">
              ФИО
            </label>
            <input
              className="w-full rounded border border-slate-300 px-3 py-2 text-sm focus:border-clinic-600 focus:outline-none focus:ring-1 focus:ring-clinic-600"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Иванов Иван Иванович"
              required
            />
          </div>
          <div className="w-full sm:w-44">
            <label className="mb-1 block text-xs font-medium text-slate-600">
              Дата рождения
            </label>
            <input
              type="date"
              className="w-full rounded border border-slate-300 px-3 py-2 text-sm focus:border-clinic-600 focus:outline-none focus:ring-1 focus:ring-clinic-600"
              value={birthDate}
              onChange={(e) => setBirthDate(e.target.value)}
              required
            />
          </div>
          <div className="w-full sm:w-40">
            <label className="mb-1 block text-xs font-medium text-slate-600">
              Пол
            </label>
            <select
              className="w-full rounded border border-slate-300 px-3 py-2 text-sm focus:border-clinic-600 focus:outline-none focus:ring-1 focus:ring-clinic-600"
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              required
            >
              <option value="">Выберите</option>
              <option value="мужской">мужской</option>
              <option value="женский">женский</option>
            </select>
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
          Список пациентов
        </h2>
        {isLoading && <p className="p-4 text-sm text-slate-500">Загрузка…</p>}
        {isError && (
          <p className="p-4 text-sm text-red-600">
            Ошибка загрузки: {error?.data?.error || error?.message || "сеть"}
          </p>
        )}
        {!isLoading && !isError && (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-100 text-slate-700">
                <tr>
                  <th className="px-4 py-2 font-medium">ID</th>
                  <th className="px-4 py-2 font-medium">ФИО</th>
                  <th className="px-4 py-2 font-medium">Дата рождения</th>
                  <th className="px-4 py-2 font-medium">Пол</th>
                </tr>
              </thead>
              <tbody>
                {data.length === 0 ? (
                  <tr>
                    <td
                      colSpan={4}
                      className="px-4 py-6 text-center text-slate-500"
                    >
                      Нет записей
                    </td>
                  </tr>
                ) : (
                  data.map((p) => (
                    <tr
                      key={p.patient_id}
                      className="border-t border-slate-100 hover:bg-slate-50"
                    >
                      <td className="px-4 py-2">{p.patient_id}</td>
                      <td className="px-4 py-2">{p.full_name}</td>
                      <td className="px-4 py-2">
                        {new Date(p.birth_date).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-2">{p.gender}</td>
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
