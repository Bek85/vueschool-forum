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
      formKey: Math.random(),
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
      this.formKey = Math.random();
    },
  },
};
</script>

<template>
  <div class="col-full">
    <VeeForm :key="formKey" @submit="save">
      <AppFormField
        v-model="postCopy.text"
        as="textarea"
        name="post"
        label="Post"
        cols="30"
        rows="10"
        rules="required"
      />
      <div class="form-actions">
        <button class="btn-blue">
          {{ post.id ? 'Update Post' : 'Submit Post' }}
        </button>
      </div>
    </VeeForm>
  </div>
</template>
