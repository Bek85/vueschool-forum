<script>
export default {
  name: 'PostEditor',
  props: {
    post: {
      type: Object,
      default: () => ({ text: null }),
    },
  },
  emits: ['save'],
  data() {
    return {
      postCopy: { ...this.post },
    };
  },
  computed: {
    threads() {
      return this.$store.state.threads.items;
    },
    posts() {
      return this.$store.state.posts.items;
    },
  },
  methods: {
    save() {
      this.$emit('save', { post: this.postCopy });
      this.postCopy.text = '';
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
          v-model="postCopy.text"
          class="form-input"
          name=""
          cols="30"
          rows="10"
        ></textarea>
      </div>
      <div class="form-actions">
        <button class="btn-blue">
          {{ post.id ? 'Update Post' : 'Submit Post' }}
        </button>
      </div>
    </form>
  </div>
</template>
