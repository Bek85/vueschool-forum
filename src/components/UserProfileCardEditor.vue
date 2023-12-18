<script>
export default {
  name: 'UserProfileCardEditor',
  props: {
    user: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      currentUser: { ...this.user },
    };
  },
  methods: {
    save() {
      this.$store.dispatch('updateUser', { ...this.currentUser });
      this.$router.push({ name: 'profile' });
    },
    cancel() {
      this.$router.push({ name: 'profile' });
    },
  },
};
</script>

<template>
  <div class="profile-card">
    <form @submit.prevent="save">
      <p class="text-center">
        <img
          :src="user.avatar"
          :alt="user.name + ' profile picture'"
          class="avatar-xlarge img-update"
        />
      </p>

      <div class="form-group">
        <input
          v-model="currentUser.username"
          type="text"
          placeholder="Username"
          class="form-input text-lead text-bold"
        />
      </div>

      <div class="form-group">
        <input
          v-model="currentUser.name"
          type="text"
          placeholder="Full Name"
          class="form-input text-lead"
        />
      </div>

      <div class="form-group">
        <label for="user_bio">Bio</label>
        <textarea
          id="user_bio"
          v-model="currentUser.bio"
          class="form-input"
          placeholder="Write a few words about yourself."
        ></textarea>
      </div>

      <div class="stats">
        <span>{{ user.postsCount }} posts</span>
        <span>{{ user.threadsCount }} threads</span>
      </div>

      <hr />

      <div class="form-group">
        <label class="form-label" for="user_website">Website</label>
        <input
          id="user_website"
          v-model="currentUser.website"
          autocomplete="off"
          class="form-input"
        />
      </div>

      <div class="form-group">
        <label class="form-label" for="user_email">Email</label>
        <input
          id="user_email"
          v-model="currentUser.email"
          autocomplete="off"
          class="form-input"
        />
      </div>

      <div class="form-group">
        <label class="form-label" for="user_location">Location</label>
        <input
          id="user_location"
          v-model="currentUser.location"
          autocomplete="off"
          class="form-input"
        />
      </div>

      <div class="btn-group space-between">
        <button class="btn-ghost" @click="cancel">Cancel</button>
        <button type="submit" class="btn-blue">Save</button>
      </div>
    </form>
  </div>
</template>
