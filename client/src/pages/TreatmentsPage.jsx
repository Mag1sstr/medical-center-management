import { useState } from "react";
import {
  useGetTreatmentsQuery,
  useAddTreatmentMutation,
  useGetAppointmentsQuery,
} from "../store/api";

function formatMoney(v) {
  const n = Number(v);
  if (Number.isNaN(n)) return String(v);
  return new Intl.NumberFormat("ru-RU", {
    style: "currency",
    currency: "RUB",
  }).format(n);
}

export default function TreatmentsPage() {
  const {
    data: treatments = [],
    isLoading,
    isError,
    error,
  } = useGetTreatmentsQuery();
  const { data: appointments = [] } = useGetAppointmentsQuery();
  const [addTreatment, { isLoading: isAdding }] = useAddTreatmentMutation();

  const [appointmentId, setAppointmentId] = useState("");
  const [description, setDescription] = useState("");
  const [cost, setCost] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    const aid = Number(appointmentId);
    if (!aid || !description.trim()) return;
    try {
      await addTreatment({
        appointment_id: aid,
        description: description.trim(),
        cost: cost === "" ? 0 : Number(cost),
      }).unwrap();
      setAppointmentId("");
      setDescription("");
      setCost("");
    } catch (_) {
      alert("Не удалось сохранить лечение");
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-clinic-900">Лечение</h1>
        <p className="mt-1 text-sm text-slate-600">
          Услуги и стоимость по приёмам
        </p>
      </div>

      <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-lg font-semibold text-slate-800">
          Добавить запись о лечении
        </h2>
        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-4 lg:flex-row lg:flex-wrap lg:items-end"
        >
          <div className="min-w-[220px] flex-1">
            <label className="mb-1 block text-xs font-medium text-slate-600">
              Приём
            </label>
            <select
              className="w-full rounded border border-slate-300 px-3 py-2 text-sm focus:border-clinic-600 focus:outline-none focus:ring-1 focus:ring-clinic-600"
              value={appointmentId}
              onChange={(e) => setAppointmentId(e.target.value)}
              required
            >
              <option value="">Выберите приём</option>
              {appointments.map((a) => (
                <option key={a.appointment_id} value={a.appointment_id}>
                  #{a.appointment_id} —{" "}
                  {a.visit_date
                    ? new Date(a.visit_date).toLocaleString("ru-RU")
                    : ""}
                </option>
              ))}
            </select>
          </div>
          <div className="min-w-[200px] flex-[2]">
            <label className="mb-1 block text-xs font-medium text-slate-600">
              Описание
            </label>
            <input
              className="w-full rounded border border-slate-300 px-3 py-2 text-sm focus:border-clinic-600 focus:outline-none focus:ring-1 focus:ring-clinic-600"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Физиотерапия, курс 5 процедур"
              required
            />
          </div>
          <div className="w-full sm:w-36">
            <label className="mb-1 block text-xs font-medium text-slate-600">
              Стоимость (тг.)
            </label>
            <input
              type="number"
              min="0"
              step="0.01"
              className="w-full rounded border border-slate-300 px-3 py-2 text-sm focus:border-clinic-600 focus:outline-none focus:ring-1 focus:ring-clinic-600"
              value={cost}
              onChange={(e) => setCost(e.target.value)}
              placeholder="0"
            />
          </div>
          <button
            type="submit"
            disabled={isAdding || appointments.length === 0}
            className="rounded bg-clinic-800 px-4 py-2 text-sm font-medium text-white hover:bg-clinic-900 disabled:opacity-50"
          >
            Добавить
          </button>
        </form>
        {appointments.length === 0 && (
          <p className="mt-3 text-sm text-amber-700">
            Сначала создайте приём на странице «Приёмы».
          </p>
        )}
      </section>

      <section className="rounded-lg border border-slate-200 bg-white shadow-sm overflow-hidden">
        <h2 className="border-b border-slate-100 bg-slate-50 px-4 py-3 text-lg font-semibold text-slate-800">
          Список лечения
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
                  <th className="px-4 py-2 font-medium">Приём</th>
                  <th className="px-4 py-2 font-medium">Описание</th>
                  <th className="px-4 py-2 font-medium">Стоимость</th>
                </tr>
              </thead>
              <tbody>
                {treatments.length === 0 ? (
                  <tr>
                    <td
                      colSpan={4}
                      className="px-4 py-6 text-center text-slate-500"
                    >
                      Нет записей
                    </td>
                  </tr>
                ) : (
                  treatments.map((t) => (
                    <tr
                      key={t.treatment_id}
                      className="border-t border-slate-100 hover:bg-slate-50"
                    >
                      <td className="px-4 py-2">{t.treatment_id}</td>
                      <td className="px-4 py-2">#{t.appointment_id}</td>
                      <td className="px-4 py-2">{t.description}</td>
                      <td className="px-4 py-2">{formatMoney(t.cost)}</td>
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
