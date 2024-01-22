<template>
  <div class="notifications">
    <TransitionGroup name="notification">
      <div
        v-for="notification in notifications"
        :key="notification.id"
        class="notification"
        :class="`notification-type-${notification.type}`"
      >
        <span>{{ notification.message }}</span>
        <button @click="removeNotification(notification.id)">x</button>
      </div>
    </TransitionGroup>
  </div>
</template>

<script setup>
import useNotifications from '@/composables/useNotifications';

const { notifications, removeNotification } = useNotifications();
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

.notification.notification-type-error {
  color: rgb(146, 5, 5);
  border-left: 5px solid rgb(146, 5, 5);
}
.notification.notification-type-success {
  border-left: 5px solid rgb(37, 161, 32);
}

.notification-enter-active,
.notification-leave-active {
  transition: all 0.5s ease;
}

.notification-enter-from,
.notification-leave-to {
  opacity: 0;
  transform: translateX(100%);
}

.notification-move {
  transition: transform 0.8s ease;
}
</style>
