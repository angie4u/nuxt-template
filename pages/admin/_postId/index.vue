<template>
  <div>
    <div class="admin-post-page">
      <section class="update-form">
        <AdminPostForm @submit="onSubmitted" :post="loadedPost" />
      </section>
    </div>
  </div>
</template>

<script>
import AdminPostForm from '@/components/Admin/AdminPostForm'

export default {
  layout: 'admin',
  components: {
    AdminPostForm
  },
  asyncData(context) {
    //아래와 같이 firebase의 realtimedatabase 를 이용해 데이터를 이용
    return context.app.$axios
      .$get('/posts/' + context.params.postId + '.json')
      .then(data => {
        return {
          loadedPost: { ...data, id: context.params.postId }
        }
      })
      .catch(e => context.error(e))
  },
  methods: {
    onSubmitted(editedPost) {
      this.$store.dispatch('editPost', editedPost).then(() => {
        this.$router.push('/admin')
      })
    }
  }
}
</script>

<style scoped>
.new-post-form {
  width: 90%;
  margin: 20px auto;
}

@media (min-width: 768px) {
  .new-post-form {
    width: 500px;
  }
}
</style>
