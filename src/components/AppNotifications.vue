<template>
  <div class="notifications">
    <div
      v-for="notification in notifications"
      :key="notification.id"
      class="notification"
    >
      {{ notification.message }}
    </div>
  </div>
</template>

<script setup>
import useNotifications from '@/composables/useNotifications';

const { notifications } = useNotifications();
</script>

<style scoped>
.notifications {
  position: fixed;
  bottom: 20px;
  right: 0;
}

.notification {
  background: #fff;
  display: flex;
  justify-content: space-between;
  width: 350px;
  box-shadow: 2px 2px 2px 2px rgba(0, 0, 0, 0.5);
  padding: 10px 20px;
  margin-bottom: 5px;
  border-left: 5px solid #263959;
}
</style>
