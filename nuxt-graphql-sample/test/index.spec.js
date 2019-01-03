import { mount, shallowMount, createLocalVue } from '@vue/test-utils'
import TestTargetVue from '../pages/index.vue'

const localVue = createLocalVue()

describe('index.vue', () => {


    test('displayed repos correctly with query data', () => {
        const wrapper = shallowMount(TestTargetVue, {localVue})
        
        wrapper.setData({
            viewer: {
                repositories: {
                    nodes: {
                        name: 'test',
                        url: 'test.com',
                        id: 'foobar'
                    }
                }
            }
        })

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
