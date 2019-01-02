<template>
  <section class="container">
    <div>
      <input type="number" name="" v-model.number="number">
      <div v-if="$apollo.loading">Loading...</div>
      <ul v-if="!$apollo.loading">
        <li v-for="repo in repos" :key="repo.name">
          <a :href="repo.url">{{repo.name}}</a>
          <span v-if="repo.viewerHasStarred">Starred</span>
          <button
            type="button"
            @click="addStar(repo.id)"
            v-if="!repo.viewerHasStarred"
          >add star</button>
        </li>
      </ul>
    </div>
  </section>
</template>

<script>
import AppLogo from '~/components/AppLogo.vue'
import getReposGql from '~/apollo/gql/getRepos.gql'
import addStarGql from '~/apollo/gql/addStar.gql'


export default {
  components: {
    AppLogo
  },
  data() {
    return {
      number: 10,
      repos: [],
      reposFromApolloQuery: [],
    } 
  },

  apollo: {
    repos: {
      query: getReposGql,
      variables() {
        return {
          number_of_repos: this.number
        }
      },
      update: data => data.viewer.repositories.nodes,
      error(error) {
        console.log('We\'ve got an error!', error)
      }
    }
  },

  methods: {
    async addStar(addStarId) {
      const { data, error } = await this.$apollo.mutate({
        mutation: addStarGql,
        variables: {
          id: addStarId
        },
        refetchQueries: [{
          query: getReposGql,
          variables: {
            number_of_repos: this.number
          }
        }]
      })

      if (error) {
        console.error(error)
      } else {
        console.log(data)
      }
    }
  }
}
</script>

<style>
.container {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
}

.title {
  font-family: "Quicksand", "Source Sans Pro", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif; /* 1 */
  display: block;
  font-weight: 300;
  font-size: 100px;
  color: #35495e;
  letter-spacing: 1px;
}

.subtitle {
  font-weight: 300;
  font-size: 42px;
  color: #526488;
  word-spacing: 5px;
  padding-bottom: 15px;
}

.links {
  padding-top: 15px;
}
</style>

