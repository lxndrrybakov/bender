import { useState } from 'react';
import type { SendGreetingPayload } from '../types';

const initialForm: SendGreetingPayload = {
  recipientName: '',
  recipientEmail: '',
  occasion: '',
  scheduledFor: '',
  message: ''
};

export function useGreetingForm(onSubmit: (payload: SendGreetingPayload) => Promise<void>) {
  const [formState, setFormState] = useState<SendGreetingPayload>(initialForm);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleChange = (field: keyof SendGreetingPayload, value: string) => {
    setFormState((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setSuccess(null);

    try {
      await onSubmit(formState);
      setSuccess('Поздравление готово к отправке!');
      setFormState(initialForm);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Неизвестная ошибка');
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    formState,
    handleChange,
    handleSubmit,
    isSubmitting,
    error,
    success
  };
}
