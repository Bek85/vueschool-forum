<script>
import { mapActions } from 'vuex';

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
      uploadingImage: false,
      currentUser: { ...this.user },
    };
  },
  methods: {
    ...mapActions('auth', ['uploadAvatar']),
    async handleAvatarUpload(evt) {
      this.uploadingImage = true;
      const file = evt.target.files[0];
      const uploadedImage = await this.uploadAvatar({ file });
      this.currentUser.avatar = uploadedImage || this.currentUser.avatar;
      this.uploadingImage = false;
    },
    async handleRandomAvatarUpload() {
      const randomAvatarGenerated =
        this.currentUser.avatar.startsWith('https://pixabay');
      if (randomAvatarGenerated) {
        const image = await fetch(this.currentUser.avatar);
        const blob = await image.blob();
        this.currentUser.avatar = await this.uploadAvatar({
          file: blob,
          filename: 'random',
        });
      }
    },

    async save() {
      await this.handleRandomAvatarUpload();
      this.$store.dispatch('users/updateUser', { ...this.currentUser });
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
      <p class="text-center avatar-edit">
        <label for="avatar">
          <AppAvatarImg
            :src="currentUser.avatar"
            :alt="user.name + ' profile picture'"
            class="avatar-xlarge img-update"
          />
          <div class="avatar-upload-overlay">
            <AppSpinner v-if="uploadingImage" color="white" />
            <Fa
              v-else
              icon="camera"
              size="3x"
              :style="{ color: 'white', opacity: '8' }"
            />
          </div>

          <input
            v-show="false"
            id="avatar"
            type="file"
            accept="image/*"
            @change="handleAvatarUpload"
          />
        </label>
      </p>
      <UserProfileCardEditorRandomAvatar @hit="currentUser.avatar = $event" />

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
        <button class="btn-ghost" @click.prevent="cancel">Cancel</button>
        <button type="submit" class="btn-blue">Save</button>
      </div>
    </form>
  </div>
</template>
