import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from './lib/api';
import { SectionCard } from './components/SectionCard';
import { GreetingList } from './components/GreetingList';
import { ManualSendForm } from './components/ManualSendForm';
import { UpcomingList } from './components/UpcomingList';
import type { SendGreetingPayload } from './types';

export default function App() {
  const queryClient = useQueryClient();

  const sentQuery = useQuery({
    queryKey: ['sent-greetings'],
    queryFn: api.getSentGreetings
  });

  const upcomingQuery = useQuery({
    queryKey: ['upcoming-greetings'],
    queryFn: api.getUpcomingGreetings
  });

  const sendGreetingMutation = useMutation({
    mutationFn: api.sendGreeting,
    onSuccess: (createdGreeting) => {
      queryClient.setQueryData(['sent-greetings'], (previous = []) => [
        createdGreeting,
        ...(previous as typeof createdGreeting[])
      ]);
      void queryClient.invalidateQueries({ queryKey: ['upcoming-greetings'] });
    }
  });

  const handleSendGreeting = async (payload: SendGreetingPayload) => {
    await sendGreetingMutation.mutateAsync(payload);
  };

  return (
    <div className="min-h-screen bg-slate-100">
      <div className="max-w-6xl mx-auto px-6 py-10 flex flex-col gap-8">
        <header className="flex flex-col gap-2">
          <span className="inline-flex items-center gap-2 text-sm font-medium text-brand-700 uppercase tracking-widest">
            Bender
          </span>
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900">
            Центр поздравлений риелторского агентства
          </h1>
          <p className="text-slate-600 max-w-3xl">
            Управляйте поздравлениями клиентов: отслеживайте отправленные письма, контролируйте будущие события и
            создавайте персонализированные сообщения с помощью встроенного генератора текста.
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <SectionCard
            title="Отправленные поздравления"
            description="История доставленных писем"
          >
            {sentQuery.isLoading ? (
              <p className="text-sm text-slate-500">Загружаем данные…</p>
            ) : sentQuery.isError ? (
              <p className="text-sm text-red-600">Не удалось получить список отправленных поздравлений.</p>
            ) : (
              <GreetingList
                items={sentQuery.data ?? []}
                emptyLabel="Отправленных поздравлений пока нет."
              />
            )}
          </SectionCard>

          <SectionCard
            title="Запланированные"
            description="Автоматические поздравления, которые вскоре будут отправлены"
          >
            {upcomingQuery.isLoading ? (
              <p className="text-sm text-slate-500">Собираем расписание…</p>
            ) : upcomingQuery.isError ? (
              <p className="text-sm text-red-600">Не удалось получить будущие поздравления.</p>
            ) : (
              <UpcomingList items={upcomingQuery.data ?? []} />
            )}
          </SectionCard>

          <SectionCard
            title="Ручная отправка"
            description="Создайте письмо и отправьте его немедленно или запланируйте на дату"
          >
            <ManualSendForm onSubmit={handleSendGreeting} />
          </SectionCard>
        </div>
      </div>
    </div>
  );
}
