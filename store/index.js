import Vuex from 'vuex'

const createStore = () => {
  return new Vuex.Store({
    state: {
      loadedPosts: [],
      token: null,
    },
    mutations: {
      setPosts(state, posts) {
        state.loadedPosts = posts
      },
      addPost(state, post) {
        state.loadedPosts.push(post)
      },
      editPost(state, editPost) {
        const postIndex = state.loadedPosts.findIndex(post => post.id === editPost.id);
        state.loadedPosts[postIndex] = editPost

      },
      setToken(state, token) {
        state.token = token;
      }
    },
    actions: {
      nuxtServerInit(vuexContext, context) {
        //아래와 같이 firebase의 realtimedatabase 를 이용해 데이터를 이용
        return context.app.$axios
          .$get('/posts.json')
          .then(data => {
            const postsArray = [];
            for (const key in data) {
              postsArray.push({ ...data[key],
                id: key
              })
            }
            vuexContext.commit('setPosts', postsArray)
          })
          .catch(e => context.error(e))
      },
      addPost(vuexContext, post) {
        const createdPost = {
          ...post,
          updatedDate: new Date()
        }
        //아래와 같이 firebase의 realtimedatabase 를 이용해 데이터를 이용
        return this.$axios.$post('/posts.json?auth=' + vuexContext.state.token, createdPost)
          .then(data => {

            vuexContext.commit('addPost', { ...createdPost,
              id: data.name
            })
          })
          .catch(e => console.log(e))
      },
      editPost(vuexContext, editedPost) {
        //아래와 같이 firebase의 realtimedatabase 를 이용해 데이터를 이용
        //firebase .write rule 이 auth!=null 인경우
        //https://firebase.google.com/docs/database/rest/auth 설명참고
        //쿼리 파라미터 필요함
        return this.$axios.$put('/posts/' + editedPost.id + '.json?auth=' + vuexContext.state.token, {
            ...editedPost
          })
          .then(data => {
            vuexContext.commit('editPost', editedPost)
          })
          .catch(error => console.log(error))
      },
      setPosts(vuexContext, posts) {
        vuexContext.commit('setPosts', posts)
      },
      authenticateUser(vuexContext, authData) {
        //sign in url : https://firebase.google.com/docs/reference/rest/auth/#section-create-email-password
        //login url : https://firebase.google.com/docs/reference/rest/auth/#section-sign-in-email-password
        //api_key : firebae - authentication - web setting

        //기본적으로 이메일을 통해 가입하도록 함
        let authUrl =
          'https://www.googleapis.com/identitytoolkit/v3/relyingparty/signupNewUser?key=' +
          process.env.fbAPIKey

        //로그인 된 상태라면, 로그인 하도록 함
        if (authData.isLogin) {
          authUrl =
            'https://www.googleapis.com/identitytoolkit/v3/relyingparty/verifyPassword?key=' +
            process.env.fbAPIKey
        }

        return this.$axios
          .$post(authUrl, {
            email: authData.email,
            password: authData.password,
            returnSecureToken: true
          })
          .then(result => {
            vuexContext.commit('setToken', result.idToken);
          })
          .catch(e => console.log(e))
      }
    },
    getters: {
      loadedPosts(state) {
        return state.loadedPosts
      }
    }
  })
}

export default createStore
