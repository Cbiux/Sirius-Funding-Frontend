import { format } from 'date-fns'
import { es } from 'date-fns/locale'

export function formatDate(date: string | { seconds: number; nanoseconds: number }) {
  try {
    if (typeof date === 'string') {
      return format(new Date(date), 'dd MMM yyyy', { locale: es })
    }
    // Si es un timestamp de Firestore
    if ('seconds' in date) {
      return format(new Date(date.seconds * 1000), 'dd MMM yyyy', { locale: es })
    }
    return 'Fecha no disponible'
  } catch (error) {
    console.error('Error al formatear la fecha:', error)
    return 'Fecha no disponible'
  }
}

export function calculateTimeLeft(deadline: string | { seconds: number; nanoseconds: number }) {
  try {
    let deadlineDate: Date;
    
    if (typeof deadline === 'string') {
      deadlineDate = new Date(deadline);
    } else if ('seconds' in deadline) {
      deadlineDate = new Date(deadline.seconds * 1000);
    } else {
      return { days: 0, hours: 0, minutes: 0, seconds: 0, isExpired: true };
    }

    const now = new Date();
    const diff = deadlineDate.getTime() - now.getTime();
    const isExpired = diff <= 0;

    if (isExpired) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0, isExpired: true };
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    return {
      days,
      hours,
      minutes,
      seconds,
      isExpired: false
    };
  } catch (error) {
    console.error('Error al calcular el tiempo restante:', error);
    return { days: 0, hours: 0, minutes: 0, seconds: 0, isExpired: true };
  }
} 