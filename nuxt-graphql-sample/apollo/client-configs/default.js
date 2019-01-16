import localForage from 'localforage'
import { ApolloLink } from 'apollo-link'
import { HttpLink } from 'apollo-link-http'
import { setContext } from 'apollo-link-context'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { persistCache } from 'apollo-cache-persist'
import { onError } from 'apollo-link-error'
import { RetryLink } from 'apollo-link-retry'
import { withClientState } from 'apollo-link-state'
import gql from 'graphql-tag'

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

    const initialState = {
        todos: []
    }

    const stateLink = withClientState({
        cache,
        default: initialState,
        resolvers: {
            Mutation: {
                addTodo: (_, { text }, { cache } ) => {
                    const query = gql`
                        query GetTodos {
                            todos @client {
                                id
                                text
                                completed
                            }
                        }
                    `
                    const previous = cache.readQuery({ query })
                    const newTodo = {
                        id: nextTodoId++,
                        text,
                        completed: false,
                        __typename: 'TodoItem',
                    }
                    const data = {
                        todos: [...previous.todos, newTodo]
                    }
                    cache.writeData({ data })
                    return newTodo
                }
            }
        }
    })

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