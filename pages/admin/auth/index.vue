<template>
  <div class="admin-auth-page">
    <div class="auth-container">
      <!-- submit.prevent : 페이지를 다시 호출하지 않도록 함.다시 호출하면 새로고침 됨 -->
      <form @submit.prevent="onSubmit">
        <AppControlInput type="email" v-model="email">E-Mail Address</AppControlInput>
        <AppControlInput type="password" v-model="password">Password</AppControlInput>
        <AppButton type="submit">{{ isLogin ? 'Login' : 'Sign Up' }}</AppButton>
        <AppButton
          type="button"
          btn-style="inverted"
          style="margin-left: 10px"
          @click="isLogin = !isLogin">Switch to {{ isLogin ? 'Signup' : 'Login' }}</AppButton>
      </form>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AdminAuthPage',
  layout: 'admin',
  data() {
    return {
      isLogin: true,
      email: '',
      password: ''
    }
  },
  methods: {
    onSubmit() {
      //sign in url : https://firebase.google.com/docs/reference/rest/auth/#section-create-email-password
      //login url : https://firebase.google.com/docs/reference/rest/auth/#section-sign-in-email-password
      //api_key : firebae - authentication - web setting

      //기본적으로 이메일을 통해 가입하도록 함
      let authUrl =
        'https://www.googleapis.com/identitytoolkit/v3/relyingparty/signupNewUser?key=' +
        process.env.fbAPIKey

      //로그인 된 상태라면, 로그인 하도록 함
      if (this.isLogin) {
        authUrl =
          'https://www.googleapis.com/identitytoolkit/v3/relyingparty/verifyPassword?key=' +
          process.env.fbAPIKey
      }

      this.$axios
        .$post(authUrl, {
          email: this.email,
          password: this.password,
          returnSecureToken: true
        })
        .then(result => {
          console.log(result)
        })
        .catch(e => console.log(e))
    }
  }
}
</script>

<style scoped>
.admin-auth-page {
  padding: 20px;
}

.auth-container {
  border: 1px solid #ccc;
  border-radius: 5px;
  box-shadow: 0 2px 2px #ccc;
  width: 300px;
  margin: auto;
  padding: 10px;
  box-sizing: border-box;
}
</style>

