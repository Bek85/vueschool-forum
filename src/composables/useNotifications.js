import { reactive } from 'vue';

const notifications = reactive([
  { id: 1, message: 'A thing happened' },
  { id: 2, message: 'Another thing happened' },
]);

export default function useNotifications() {
  return {
    notifications,
  };
}
