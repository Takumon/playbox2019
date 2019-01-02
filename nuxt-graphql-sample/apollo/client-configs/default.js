import { ApolloLink } from 'apollo-link'
import { HttpLink } from 'apollo-link-http'
import { setContext } from 'apollo-link-context'
import { InMemoryCache } from 'apollo-cache-inmemory'

export default (context) => {

    const httpLink = new HttpLink({uri: 'https://api.github.com/graphql'})

    const authLink = setContext((_, { headers }) => ({
        headers: {
            Authorization: `bearer ${context.env.GITHUB_TOKEN}`
        }
    }))

    const link = ApolloLink.from([
        authLink,
        httpLink
    ])

    return {
        link,
        cache: new InMemoryCache()
    }
}