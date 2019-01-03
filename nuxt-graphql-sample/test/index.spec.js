import { mount, shallowMount, createLocalVue } from '@vue/test-utils'
import flushPromises from 'flush-promises'
import { makeExecutableSchema, addMockFunctionsToSchema } from 'graphql-tools'
import { graphql } from 'graphql'
import TestTargetVue from '../pages/index.vue'
import getReposGql  from '../apollo/gql/getRepos.gql'


const localVue = createLocalVue()

const schemeMock = `
type User {
    repositories(
        last:Int
    ): RepositoryConnection!
}

type RepositoryConnection {
    nodes: [Repository]
}

type Repository {
    id: ID!
    name: String!
    url: String!
    viewerHasStarred: Boolean!
}

type AddStarPayload {
    clientMutationId: String
    starrable: Starrable!
}

type Starrable {
    id: ID!
    viewerHasStarred: Boolean!
}

input AddStarInput {
    starrabledId: ID!
    clientNutationId: String
}

type Query {
    viewer: User!
}

type Mutation {
    addStar(input: AddStarInput!): AddStarPayload
}

schema {
    query: Query
    mutation: Mutation
}
`




const schema = makeExecutableSchema({
    typeDefs: schemeMock,
})

const reposMock = {
    User: () => {
        const nodes = [
            {
                id: 'shagfajk',
                name: 'testname',
                url: 'github.com/hoge',
                viewerHasStarred: false
            },
            {
                id: 'shagfajk',
                name: 'testname',
                url: 'github.com/hoge',
                viewerHasStarred: false
            },
            {
                id: 'shagfajk1',
                name: 'testname1',
                url: 'github.com/hoge1',
                viewerHasStarred: false
            },
            {
                id: 'shagfajk2',
                name: 'testname2',
                url: 'github.com/hoge2',
                viewerHasStarred: false
            },
            {
                id: 'shagfajk3',
                name: 'testname3',
                url: 'github.com/hoge3',
                viewerHasStarred: false
            },
            {
                id: 'shagfajk4',
                name: 'testname4',
                url: 'github.com/hoge4',
                viewerHasStarred: false
            },
            {
                id: 'shagfajk5',
                name: 'testname5',
                url: 'github.com/hoge5',
                viewerHasStarred: false
            },
            {
                id: 'shagfajk5',
                name: 'testname5',
                url: 'github.com/hoge5',
                viewerHasStarred: false
            },
            {
                id: 'shagfajk6',
                name: 'testname6',
                url: 'github.com/hoge6',
                viewerHasStarred: false
            },
        ]


        return {
            repositories: (root, {last}) => {
                const filtered = 
                    (nodes.length <= last)
                    ? nodes
                    : nodes.slice(0, last)
            
                return {
                    nodes: filtered
                }
            }
        }
    }
}

addMockFunctionsToSchema({
    schema,
    mocks: reposMock,
})

describe('index.vue', () => {


    test('displayed repos correctly with query data', async () => {
        const wrapper = shallowMount(TestTargetVue, {localVue})

        const {errors, data} = await graphql({
            schema, 
            source: getReposGql.loc.source.body,
            variableValues: {
                number_of_repos: 4
            }
        })

        wrapper.setData(data)
        await flushPromises()
        expect(wrapper.element).toMatchSnapshot()
    })

    test('called Apollo mutation in addStar() method', () => {
        const mutate = jest.fn().mockReturnValue({
            data: {
                value: 'testData'
            }
        });
        const wrapper = mount(TestTargetVue, {
            localVue,
            mocks: {
                $apollo: {
                    mutate,
                }
            }
        })

        wrapper.vm.addStar()
        expect(mutate).toBeCalled()
    })
})
