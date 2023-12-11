<script>
export default {
  name: 'PostEditor',
  emits: ['save'],
  data() {
    return {
      text: '',
    };
  },
  computed: {
    threads() {
      return this.$store.state.threads;
    },
    posts() {
      return this.$store.state.posts;
    },
  },
  methods: {
    save() {
      const post = {
        text: this.text,
        publishedAt: Math.floor(Date.now() / 1000),
        // TODO: Replace with the current user's ID
        userId: 'ALXhxjwgY9PinwNGHpfai6OWyDu2',
      };
      this.$emit('save', { post });
      this.text = '';
    },
  },
};
</script>

<template>
  <div class="col-full">
    <form @submit.prevent="save">
      <div class="form-group">
        <textarea
          id=""
          v-model="text"
          class="form-input"
          name=""
          cols="30"
          rows="10"
        ></textarea>
      </div>
      <div class="form-actions">
        <button class="btn-blue">Submit post</button>
      </div>
    </form>
  </div>
</template>
