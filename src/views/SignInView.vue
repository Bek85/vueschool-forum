<script>
export default {
  name: 'SignIn',
  data() {
    return {
      form: {
        email: '',
        password: '',
      },
    };
  },
};
</script>

<template>
  <div class="flex-grid justify-center">
    <div class="col-2">
      <form class="card card-form" @submit.prevent="signIn">
        <h1 class="text-center">Login</h1>

        <div class="form-group">
          <label for="email">Email</label>
          <input
            id="email"
            v-model="form.email"
            type="text"
            class="form-input"
          />
        </div>
        <div class="form-group">
          <label for="password">Password</label>
          <input
            id="password"
            v-model="form.password"
            type="password"
            class="form-input"
          />
        </div>

        <div class="push-top">
          <button type="submit" class="btn-blue btn-block">Log in</button>
        </div>

        <div class="form-actions text-right">
          <RouterLink :to="{ name: 'register' }">Create an account?</RouterLink>
        </div>
      </form>

      <div class="push-top text-center">
        <button class="btn-red btn-xsmall">
          <i class="fa fa-google fa-btn"></i>Sign in with Google
        </button>
      </div>
    </div>
  </div>
</template>
