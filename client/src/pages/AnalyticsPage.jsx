import {
  useGetAnalyticsAppointmentsQuery,
  useGetDoctorLoadQuery,
  useGetTotalIncomeQuery,
  useGetIncomeByDoctorQuery,
  useGetDiagnosisStatsQuery,
} from '../store/api';

function formatMoney(v) {
  const n = Number(v);
  if (Number.isNaN(n)) return String(v);
  return new Intl.NumberFormat('ru-RU', { style: 'currency', currency: 'RUB' }).format(n);
}

export default function AnalyticsPage() {
  const q1 = useGetAnalyticsAppointmentsQuery();
  const q2 = useGetDoctorLoadQuery();
  const q3 = useGetTotalIncomeQuery();
  const q4 = useGetIncomeByDoctorQuery();
  const q5 = useGetDiagnosisStatsQuery();

  const loading =
    q1.isLoading || q2.isLoading || q3.isLoading || q4.isLoading || q5.isLoading;
  const errMsg =
    q1.error || q2.error || q3.error || q4.error || q5.error
      ? 'Проверьте, что API запущен и база доступна.'
      : null;

  const appointments = q1.data ?? [];
  const doctorLoad = q2.data ?? [];
  const totalIncome = q3.data?.total_income ?? 0;
  const incomeByDoctor = q4.data ?? [];
  const diagnosisStats = q5.data ?? [];

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-2xl font-bold text-clinic-900">Аналитика</h1>
        <p className="mt-1 text-sm text-slate-600">
          Приёмы с пациентами и врачами, загрузка, доходы и статистика диагнозов
        </p>
      </div>

      {loading && <p className="text-sm text-slate-500">Загрузка данных…</p>}
      {errMsg && !loading && <p className="text-sm text-red-600">{errMsg}</p>}

      <section className="rounded-lg border border-slate-200 bg-white shadow-sm overflow-hidden">
        <h2 className="border-b border-slate-100 bg-slate-50 px-4 py-3 text-lg font-semibold text-slate-800">
          Приёмы (JOIN пациенты + врачи)
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-100 text-slate-700">
              <tr>
                <th className="px-4 py-2 font-medium">ID</th>
                <th className="px-4 py-2 font-medium">Дата</th>
                <th className="px-4 py-2 font-medium">Пациент</th>
                <th className="px-4 py-2 font-medium">Врач</th>
                <th className="px-4 py-2 font-medium">Специальность</th>
                <th className="px-4 py-2 font-medium">Диагноз</th>
              </tr>
            </thead>
            <tbody>
              {appointments.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-6 text-center text-slate-500">
                    Нет приёмов
                  </td>
                </tr>
              ) : (
                appointments.map((row) => (
                  <tr key={row.appointment_id} className="border-t border-slate-100 hover:bg-slate-50">
                    <td className="px-4 py-2">{row.appointment_id}</td>
                    <td className="px-4 py-2 whitespace-nowrap">
                      {row.visit_date && new Date(row.visit_date).toLocaleString('ru-RU')}
                    </td>
                    <td className="px-4 py-2">{row.patient_name}</td>
                    <td className="px-4 py-2">{row.doctor_name}</td>
                    <td className="px-4 py-2">{row.doctor_specialty}</td>
                    <td className="px-4 py-2">{row.diagnosis ?? '—'}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>

      <div className="grid gap-8 lg:grid-cols-2">
        <section className="rounded-lg border border-slate-200 bg-white shadow-sm overflow-hidden">
          <h2 className="border-b border-slate-100 bg-slate-50 px-4 py-3 text-lg font-semibold text-slate-800">
            Загрузка врачей (кол-во приёмов)
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-100 text-slate-700">
                <tr>
                  <th className="px-4 py-2 font-medium">Врач</th>
                  <th className="px-4 py-2 font-medium">Специальность</th>
                  <th className="px-4 py-2 font-medium">Приёмов</th>
                </tr>
              </thead>
              <tbody>
                {doctorLoad.map((d) => (
                  <tr key={d.doctor_id} className="border-t border-slate-100 hover:bg-slate-50">
                    <td className="px-4 py-2">{d.full_name}</td>
                    <td className="px-4 py-2">{d.specialty}</td>
                    <td className="px-4 py-2">{d.appointment_count}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="space-y-4">
          <div className="rounded-lg border border-clinic-600/20 bg-clinic-50 p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-clinic-900">Общий доход</h2>
            <p className="mt-2 text-3xl font-bold text-clinic-800">{formatMoney(totalIncome)}</p>
            <p className="mt-1 text-xs text-slate-600">Сумма поля cost по всем записям лечения</p>
          </div>

          <section className="rounded-lg border border-slate-200 bg-white shadow-sm overflow-hidden">
            <h2 className="border-b border-slate-100 bg-slate-50 px-4 py-3 text-lg font-semibold text-slate-800">
              Доход по врачам
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-100 text-slate-700">
                  <tr>
                    <th className="px-4 py-2 font-medium">Врач</th>
                    <th className="px-4 py-2 font-medium">Специальность</th>
                    <th className="px-4 py-2 font-medium">Доход</th>
                  </tr>
                </thead>
                <tbody>
                  {incomeByDoctor.map((d) => (
                    <tr key={d.doctor_id} className="border-t border-slate-100 hover:bg-slate-50">
                      <td className="px-4 py-2">{d.full_name}</td>
                      <td className="px-4 py-2">{d.specialty}</td>
                      <td className="px-4 py-2">{formatMoney(d.total_income)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </section>
      </div>

      <section className="rounded-lg border border-slate-200 bg-white shadow-sm overflow-hidden">
        <h2 className="border-b border-slate-100 bg-slate-50 px-4 py-3 text-lg font-semibold text-slate-800">
          Статистика по диагнозам
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-100 text-slate-700">
              <tr>
                <th className="px-4 py-2 font-medium">Диагноз</th>
                <th className="px-4 py-2 font-medium">Количество</th>
              </tr>
            </thead>
            <tbody>
              {diagnosisStats.length === 0 ? (
                <tr>
                  <td colSpan={2} className="px-4 py-6 text-center text-slate-500">
                    Нет данных
                  </td>
                </tr>
              ) : (
                diagnosisStats.map((row, i) => (
                  <tr key={i} className="border-t border-slate-100 hover:bg-slate-50">
                    <td className="px-4 py-2">{row.diagnosis}</td>
                    <td className="px-4 py-2">{row.count}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
