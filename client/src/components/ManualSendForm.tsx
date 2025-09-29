import type { SendGreetingPayload } from '../types';
import { useGreetingForm } from '../hooks/useGreetingForm';

interface ManualSendFormProps {
  onSubmit: (payload: SendGreetingPayload) => Promise<void>;
}

export function ManualSendForm({ onSubmit }: ManualSendFormProps) {
  const { formState, handleChange, handleSubmit, isSubmitting, error, success } = useGreetingForm(onSubmit);

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <label className="flex flex-col text-sm font-medium text-slate-600 gap-1">
          Имя клиента
          <input
            required
            type="text"
            value={formState.recipientName}
            onChange={(event) => handleChange('recipientName', event.target.value)}
            className="border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-200"
          />
        </label>
        <label className="flex flex-col text-sm font-medium text-slate-600 gap-1">
          Email клиента
          <input
            required
            type="email"
            value={formState.recipientEmail}
            onChange={(event) => handleChange('recipientEmail', event.target.value)}
            className="border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-200"
          />
        </label>
      </div>
      <label className="flex flex-col text-sm font-medium text-slate-600 gap-1">
        Повод
        <input
          required
          type="text"
          value={formState.occasion}
          onChange={(event) => handleChange('occasion', event.target.value)}
          placeholder="День рождения, годовщина сделки..."
          className="border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-200"
        />
      </label>
      <label className="flex flex-col text-sm font-medium text-slate-600 gap-1">
        Дата отправки
        <input
          type="date"
          value={formState.scheduledFor ?? ''}
          onChange={(event) => handleChange('scheduledFor', event.target.value)}
          className="border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-200"
        />
      </label>
      <label className="flex flex-col text-sm font-medium text-slate-600 gap-1">
        Свой текст (опционально)
        <textarea
          value={formState.message ?? ''}
          onChange={(event) => handleChange('message', event.target.value)}
          rows={4}
          className="border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-200"
          placeholder="Оставьте пустым, чтобы Bender подобрал текст автоматически"
        />
      </label>
      {error ? <p className="text-sm text-red-600">{error}</p> : null}
      {success ? <p className="text-sm text-emerald-600">{success}</p> : null}
      <button
        type="submit"
        disabled={isSubmitting}
        className="inline-flex items-center justify-center gap-2 rounded-lg bg-brand-600 hover:bg-brand-700 text-white px-4 py-2 transition"
      >
        {isSubmitting ? 'Готовим поздравление…' : 'Сформировать и отправить'}
      </button>
    </form>
  );
}
