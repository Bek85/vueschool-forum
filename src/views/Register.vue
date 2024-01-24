<script>
export default {
  name: 'RegisterView',

  emits: ['ready'],
  data() {
    return {
      avatarPreview: null,
      form: {
        name: '',
        username: '',
        email: '',
        password: '',
        avatar: '',
      },
    };
  },

  created() {
    this.$emit('ready');
  },

  methods: {
    async register() {
      await this.$store.dispatch('auth/registerUserWithEmailAndPassword', {
        ...this.form,
      });

      this.$router.push('/');
    },
    async registerWithGoogle() {
      await this.$store.dispatch('auth/signInWithGoogle');
      this.$router.push({ name: 'home' });
    },
    handleImageUpload(evt) {
      this.form.avatar = evt.target.files[0];
      const reader = new FileReader();
      reader.onload = (evt) => {
        this.avatarPreview = evt.target.result;
      };
      reader.readAsDataURL(this.form.avatar);
    },
  },
};
</script>

<template>
  <div class="flex-grid justify-center">
    <div class="col-2">
      <VeeForm class="card card-form" @submit="register">
        <h1 class="text-center">Register</h1>

        <AppFormField
          v-model="form.name"
          name="name"
          label="Name"
          type="text"
          rules="required"
        />

        <AppFormField
          v-model="form.username"
          name="username"
          label="Username"
          type="text"
          rules="required|unique:users,username"
        />

        <AppFormField
          v-model="form.email"
          name="email"
          label="Email"
          type="email"
          rules="required|email|unique:users,email"
        />

        <AppFormField
          v-model="form.password"
          name="password"
          label="Password"
          type="password"
          rules="required|min:8"
        />

        <div class="form-group">
          <label for="avatar"
            >Avatar

            <div v-if="avatarPreview">
              <img :src="avatarPreview" class="avatar-xlarge" alt="" />
            </div>
          </label>
          <VeeField
            v-show="!avatarPreview"
            id="avatar"
            name="avatar"
            type="file"
            class="form-input"
            accept="image/*"
            @change="handleImageUpload"
          />
        </div>

        <div class="form-actions">
          <button type="submit" class="btn-blue btn-block">Register</button>
        </div>
      </VeeForm>
      <div class="text-center push-top">
        <button class="btn-red btn-xsmall" @click="registerWithGoogle">
          <i class="fa fa-google fa-btn"></i>Sign up with Google
        </button>
      </div>
    </div>
  </div>
</template>
