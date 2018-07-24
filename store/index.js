import Vuex from 'vuex'

const createStore = () => {
  return new Vuex.Store({
    state: {
      loadedPosts: []
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
        return this.$axios.$post('/posts.json', createdPost)
          .then(data => {

            vuexContext.commit('addPost', { ...createdPost,
              id: data.name
            })
          })
          .catch(e => console.log(e))
      },
      editPost(vuexContext, editedPost) {
        //아래와 같이 firebase의 realtimedatabase 를 이용해 데이터를 이용
        return this.$axios.$put('/posts/' + editedPost.id + '.json', {
            ...editedPost
          })
          .then(data => {
            vuexContext.commit('editPost', editedPost)
          })
          .catch(error => console.log(error))
      },
      setPosts(vuexContext, posts) {
        vuexContext.commit('setPosts', posts)
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
