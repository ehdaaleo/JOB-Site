import { config } from '@vue/test-utils'

// Global components for RouterLink and RouterView
config.global.components = {
  RouterLink: {
    props: ['to', 'custom', 'activeClass', 'exactActiveClass'],
    template: '<a :href="to"><slot /></a>',
  },
  RouterView: {
    template: '<div><slot /></div>',
  },
}
