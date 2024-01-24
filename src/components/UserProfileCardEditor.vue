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
    <VeeForm @submit="save">
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

      <AppFormField
        v-model="currentUser.username"
        name="username"
        label="Username"
      />

      <AppFormField
        v-model="currentUser.name"
        name="username"
        label="Full Name"
      />

      <AppFormField
        v-model="currentUser.bio"
        as="textarea"
        name="bio"
        label="Bio"
      />

      <div class="stats">
        <span>{{ user.postsCount }} posts</span>
        <span>{{ user.threadsCount }} threads</span>
      </div>

      <hr />

      <AppFormField
        v-model="currentUser.website"
        name="website"
        label="Website"
        autocomplete="off"
      />

      <AppFormField
        v-model="currentUser.email"
        name="email"
        label="Email"
        autocomplete="off"
      />

      <AppFormField
        v-model="currentUser.location"
        name="location"
        label="Location"
        autocomplete="off"
      />

      <div class="btn-group space-between">
        <button class="btn-ghost" @click.prevent="cancel">Cancel</button>
        <button type="submit" class="btn-blue">Save</button>
      </div>
    </VeeForm>
  </div>
</template>
