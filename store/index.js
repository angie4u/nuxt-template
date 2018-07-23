import Vuex from 'vuex'
import axios from 'axios'
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
        return axios.get(process.env.baseUrl + '/posts.json')
          .then(res => {
            const postsArray = [];
            for (const key in res.data) {
              postsArray.push({ ...res.data[key],
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
        return axios.post(process.env.baseUrl + '/posts.json', createdPost)
          .then(result => {

            vuexContext.commit('addPost', { ...createdPost,
              id: result.data.name
            })
          })
          .catch(e => console.log(e))
      },
      editPost(vuexContext, editedPost) {
        //아래와 같이 firebase의 realtimedatabase 를 이용해 데이터를 이용
        return axios.put(process.env.baseUrl + '/posts/' + editedPost.id + '.json', {
            ...editedPost
          })
          .then(res => {
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
