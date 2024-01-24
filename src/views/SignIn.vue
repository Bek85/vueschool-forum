<script>
export default {
  name: 'SignIn',
  emits: ['ready'],
  data() {
    return {
      form: {
        email: '',
        password: '',
      },
    };
  },
  created() {
    this.$emit('ready');
  },
  methods: {
    async signIn() {
      try {
        await this.$store.dispatch('auth/signInWithEmailAndPassword', {
          ...this.form,
        });
        this.successRedirect();
      } catch (error) {
        alert(error.message);
      }
    },
    async signInWithGoogle() {
      await this.$store.dispatch('auth/signInWithGoogle');
      this.successRedirect();
    },
    successRedirect() {
      const redirectTo = this.$route.query.redirectTo || { name: 'home' };
      this.$router.push(redirectTo);
    },
  },
};
</script>

<template>
  <div class="flex-grid justify-center">
    <div class="col-2">
      <VeeForm class="card card-form" @submit="signIn">
        <h1 class="text-center">Login</h1>

        <AppFormField
          v-model="form.email"
          name="email"
          label="Email"
          type="email"
          rules="required|email"
        />

        <AppFormField
          v-model="form.password"
          name="password"
          label="Password"
          type="password"
          rules="required|min:8"
        />

        <div class="push-top">
          <button type="submit" class="btn-blue btn-block">Log in</button>
        </div>

        <div class="form-actions text-right">
          <RouterLink :to="{ name: 'register' }">Create an account?</RouterLink>
        </div>
      </VeeForm>

      <div class="push-top text-center">
        <button class="btn-red btn-xsmall" @click="signInWithGoogle">
          <i class="fa fa-google fa-btn"></i>Sign in with Google
        </button>
      </div>
    </div>
  </div>
</template>
