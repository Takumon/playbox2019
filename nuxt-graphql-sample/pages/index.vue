<template>
  <section class="container">
    <div>
      <div v-if="$apollo.loading">Loading...</div>
      <h1>Smart Queryのやつ</h1>
      <ul>
        <li v-for="repo in repos" :key="repo.url">
          <a :href="repo.url">{{repo.name}}</a>
        </li>
      </ul>
      <h1>Apollo Queryのやつ</h1>
      <ul>
        <li v-for="repo in reposFromApolloQuery" :key="repo.url">
          <a :href="repo.url">{{repo.name}}</a>
        </li>
      </ul>
    </div>
  </section>
</template>

<script>
import AppLogo from '~/components/AppLogo.vue'
import getReposGql from '~/apollo/gql/getRepos.gql'
import GetRepoNames from '~/apollo/gql/sample.gql'

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
      query: GetRepoNames,
      variables() {
        return {
          number_of_repos: this.number
        }
      },
      update: data => data.viewer.repositories.nodes
    }
  },

  created: async function () {
    const result = await this.$apollo.query({
      query: GetRepoNames,
      variables: {
        number_of_repos: this.number
      },
    })
    this.reposFromApolloQuery = result.data.viewer.repositories.nodes
  },
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

