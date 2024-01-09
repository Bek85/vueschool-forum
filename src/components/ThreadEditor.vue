<script>
export default {
  props: {
    title: {
      type: String,
      default: '',
    },
    text: {
      type: String,
      default: '',
    },
  },
  emits: ['save', 'cancel'],

  data() {
    return {
      form: {
        title: this.title,
        text: this.text,
      },
    };
  },

  computed: {
    existing() {
      return !!this.title;
    },
  },
  watch: {
    form: {
      handler() {
        if (this.form.title !== this.title || this.form.text !== this.text) {
          this.$emit('dirty');
        } else {
          this.$emit('clean');
        }
      },
      deep: true,
    },
  },

  methods: {
    save() {
      this.$emit('clean');
      this.$emit('save', { ...this.form });
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
        v-model="form.title"
        type="text"
        class="form-input"
        name="title"
      />
    </div>

    <div class="form-group">
      <label for="thread_content">Content:</label>
      <textarea
        id="thread_content"
        v-model="form.text"
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
      <button class="btn btn-blue" type="submit" name="Publish">
        {{ existing ? 'Update' : 'Publish' }}
      </button>
    </div>
  </form>
</template>
