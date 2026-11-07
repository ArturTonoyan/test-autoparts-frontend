import { createTheme, rem } from '@mantine/core'

export const theme = createTheme({
  primaryColor: 'brand',
  primaryShade: 5,
  fontFamily: '"Plus Jakarta Sans", "Segoe UI", system-ui, sans-serif',
  fontFamilyMonospace: '"IBM Plex Mono", ui-monospace, Menlo, monospace',
  headings: {
    fontFamily: '"Plus Jakarta Sans", "Segoe UI", system-ui, sans-serif',
    fontWeight: '700',
    sizes: {
      h1: { fontSize: rem(30), lineHeight: '1.2' },
      h2: { fontSize: rem(18), lineHeight: '1.3' },
      h3: { fontSize: rem(15), lineHeight: '1.35' },
    },
  },
  defaultRadius: 'lg',
  cursorType: 'pointer',
  colors: {
    brand: [
      '#eef2ff',
      '#dbe4ff',
      '#bac8ff',
      '#91a7ff',
      '#748ffc',
      '#4c6ef5',
      '#3b5bdb',
      '#364fc7',
      '#2f44ad',
      '#283a8f',
    ],
    coral: [
      '#fff4f0',
      '#ffe4db',
      '#ffc4b0',
      '#ffa182',
      '#ff855e',
      '#ff7347',
      '#fa5c2c',
      '#e04b1f',
      '#c03f19',
      '#9e3314',
    ],
  },
  components: {
    Button: {
      defaultProps: { radius: 'xl', fw: 600 },
    },
    Paper: {
      defaultProps: {
        shadow: 'none',
        radius: 'xl',
        withBorder: false,
      },
    },
    TextInput: {
      defaultProps: { size: 'md', radius: 'xl' },
    },
    Select: {
      defaultProps: { size: 'md', radius: 'xl' },
    },
    SegmentedControl: {
      defaultProps: { radius: 'xl' },
    },
    Table: {
      defaultProps: {
        highlightOnHover: true,
        verticalSpacing: 'md',
        horizontalSpacing: 'md',
      },
    },
  },
})
