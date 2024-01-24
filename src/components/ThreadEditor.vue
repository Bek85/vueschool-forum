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
  <VeeForm @submit="save">
    <AppFormField
      v-model="form.title"
      name="title"
      label="Title"
      rules="required"
    />

    <AppFormField
      v-model="form.text"
      as="textarea"
      name="content"
      label="Content"
      rules="required"
      rows="8"
      cols="140"
    />

    <div class="btn-group">
      <button class="btn btn-ghost" @click.prevent="$emit('cancel')">
        Cancel
      </button>
      <button class="btn btn-blue" type="submit" name="Publish">
        {{ existing ? 'Update' : 'Publish' }}
      </button>
    </div>
  </VeeForm>
</template>
