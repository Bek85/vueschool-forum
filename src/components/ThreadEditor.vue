<script>
export default {
  props: {
    forumId: {
      type: String,
      required: true,
    },
  },
  emits: ['save', 'cancel'],
  data() {
    return {
      title: '',
      text: '',
    };
  },
  methods: {
    save() {
      this.$emit('save', { title: this.title, text: this.text });
    },
  },
};
</script>

<template>
  <form @submit.prevent="save">
    <div class="form-group">
      <label for="thread_title">Title:</label>
      <input
        id="thread_title"
        v-model="title"
        type="text"
        class="form-input"
        name="title"
      />
    </div>

    <div class="form-group">
      <label for="thread_content">Content:</label>
      <textarea
        id="thread_content"
        v-model="text"
        class="form-input"
        name="content"
        rows="8"
        cols="140"
      ></textarea>
    </div>

    <div class="btn-group">
      <button class="btn btn-ghost" @click.prevent="$emit('cancel')">
        Cancel
      </button>
      <button class="btn btn-blue" type="submit" name="Publish">Publish</button>
    </div>
  </form>
</template>
