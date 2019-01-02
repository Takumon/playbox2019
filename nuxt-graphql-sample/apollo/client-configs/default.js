import localForage from 'localforage'
import { ApolloLink } from 'apollo-link'
import { HttpLink } from 'apollo-link-http'
import { setContext } from 'apollo-link-context'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { persistCache } from 'apollo-cache-persist'
import { onError } from 'apollo-link-error'
import { RetryLink } from 'apollo-link-retry'


export default (context) => {

    const httpLink = new HttpLink({uri: 'https://api.github.com/graphql'})

    const authLink = setContext((_, { headers }) => ({
        headers: {
            Authorization: `bearer ${context.env.GITHUB_TOKEN}`
        }
    }))

    const errorLink = onError(({ graphQLErrors, networkError}) => {
        if (graphQLErrors) {
            graphQLErrors.map(({ message, location, path}) => {
                console.log(
                    `[GraphQL error]: Message: ${message},
                    Location: ${location}, Path: ${path}`
                )
            })
        }

        if (networkError) {
            console.log(`[Network error]: ${networkError}`)
            // Storeにdispatchすることも可能
            // context.store.action.dispatch('onError')
        }
    })

    const retryLink = new RetryLink({
        delay: {
            initial: 300,
            max: Infinity,
            jitter: true,
        },
        attempts: {
            max: 5,
            retryIf: (error, _option) => !!error
        },
    })

    const link = ApolloLink.from([
        authLink,
        httpLink,
        errorLink,
        retryLink,
    ])


    const cache = new InMemoryCache()

    persistCache({
        cache,
        storage: localForage,
    })


    const defaultOptions = {
        watchQuery: {
            fetchPolicy: 'cache-and-network'
        },
        query: {
            fetchPolicy: 'cache-and-network'
        }
    }


    return {
        link,
        cache,
        defaultOptions,
    }
}