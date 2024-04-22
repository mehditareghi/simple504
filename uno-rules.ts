import type { Rule, Shortcut } from 'unocss';

export const rules: Rule[] = [
  // project specific rules
  ['font-display', { 'font-family': 'Nohemi , aspekta, inter, system-ui ' }],
  ['font-content', { 'font-family': ' inter, system-ui ' }],
  ['max-w-main', { 'max-width': 'calc(100vw - var(--jh-sidebar-width))' }],

  // font size utility classes without affecting line height
  ['fs-2xs', { 'font-size': '0.6rem' }],
  ['fs-xs', { 'font-size': '0.75rem' }],
  ['fs-sm', { 'font-size': '0.875rem' }],
  ['fs-md', { 'font-size': '1rem' }],
  ['fs-base', { 'font-size': '1rem' }],
  ['fs-lg', { 'font-size': '1.125rem' }],
  ['fs-xl', { 'font-size': '1.25rem' }],
  ['fs-2xl', { 'font-size': '1.5rem' }],
  ['fs-3xl', { 'font-size': '1.875rem' }],
  ['fs-4xl', { 'font-size': '2.25rem' }],
  ['fs-5xl', { 'font-size': '3rem' }],
  ['fs-6xl', { 'font-size': '3.75rem' }],
  ['fs-7xl', { 'font-size': '4.5rem' }],
  ['fs-8xl', { 'font-size': '6rem' }],
  ['fs-9xl', { 'font-size': '8rem' }],
  // line height utility classes
  ['text-2xs', { 'font-size': '0.6rem', 'line-height': '0.9rem' }],
  ['c-subdued', { color: 'var(--rx-slate11)' }],

  // project specific
  [/^var-(.*):(.*)$/, ([, varName, value]) => ({ [`--${varName}`]: `${value}` })],
  [/^content-(.*)$/, ([, cnt]) => ({ content: `"${cnt}"` })],
  [
    /^grid-auto-fill-(.*)$/,
    ([, minColWidth]) => ({ 'grid-template-columns': `repeat(auto-fill, minmax(min(${minColWidth}, 100%), 1fr))` }),
  ],
  [
    /^grid-auto-fit-(.*)$/,
    ([, minColWidth]) => ({ 'grid-template-columns': `repeat(auto-fit, minmax(min(${minColWidth}, 100%), 1fr))` }),
  ],

  // colors
  ['b-transparent', { 'border-color': 'transparent' }],
  ['c-transparent', { color: 'transparent' }],

  ['bg-transparent', { 'background-color': 'transparent' }],
  // ['c12', { color: 'var(--jh-c12, var(--jh-rx-gray12))' }],
  // ['c11', { color: 'var(--jh-c11, var(--jh-rx-gray11))' }],
  // ['c7', { color: 'var(--jh-c7, var(--jh-rx-gray7))' }],
  // ['c9', { color: 'var(--jh-c9, var(--jh-rx-gray9))' }],
  // ['c10', { color: 'var(--jh-c10, var(--jh-rx-gray10))' }],
  // ['c8', { color: 'var(--jh-c8, var(--jh-rx-gray8))' }],
  // [
  //   /^c-([a-z]+)$/,
  //   ([, color], { rawSelector, currentSelector, variantHandlers, theme }) => {
  //     return `
  //         .c-${color}  {
  //           --jh-c12 : var(--jh-rx-${color}12);
  //           --jh-c11 : var(--jh-rx-${color}11);
  //           --jh-c7 : var(--jh-rx-${color}7);
  //           --jh-c10 : var(--jh-rx-${color}10);
  //           --jh-c9 : var(--jh-rx-${color}9);
  //           --jh-c8 : var(--jh-rx-${color}8);
  //           --jh-rx-${color}12: ${theme.colors[`${color}12`]};
  //           --jh-rx-${color}11: ${theme.colors[`${color}11`]};
  //           --jh-rx-${color}10: ${theme.colors[`${color}10`]};
  //           --jh-rx-${color}11: ${theme.colors[`${color}11`]};
  //           --jh-rx-${color}7: ${theme.colors[`${color}7`]};
  //           --jh-rx-${color}9: ${theme.colors[`${color}9`]};
  //           --jh-rx-${color}8: ${theme.colors[`${color}8`]};
  //         }
  //         `;
  //   },
  // ],

  // [
  //   /^b-([a-z]+)$/,
  //   ([, color], { rawSelector, currentSelector, variantHandlers, theme }) => {
  //     const res = `
  //     .b-${color}  {

  //           --jh-b8 : var(--jh-rx-${color}8);
  //           --jh-b7 : var(--jh-rx-${color}7);
  //           --jh-b6 : var(--jh-rx-${color}6);
  //           --jh-rx-${color}8: ${theme.colors[`${color}8`]};
  //           --jh-rx-${color}7: ${theme.colors[`${color}7`]};
  //           --jh-rx-${color}6: ${theme.colors[`${color}6`]};
  //         }
  //         `;

  //     return res;
  //   },
  // ],
  // [/^b(6|7|8)$/, ([, colorLevel]) => ({ 'border-color': `var(--jh-b${colorLevel})`, 'border-style': 'solid' })],
  // [/^bg(1|2|3|4|5|6|7|8|9|10|11|12)$/, ([, colorLevel]) => ({ 'background-color': `var(--jh-bg${colorLevel})` })],
  // [
  //   /^bg-([a-z]+)$/,
  //   ([, color], { rawSelector, currentSelector, variantHandlers, theme }) => {
  //     return `
  //         .bg-${color}  {
  //           --jh-bg10 : var(--jh-rx-${color}10);
  //           --jh-bg9 : var(--jh-rx-${color}9);
  //           --jh-bg8 : var(--jh-rx-${color}8);
  //           --jh-bg7 : var(--jh-rx-${color}7);
  //           --jh-bg6 : var(--jh-rx-${color}6);
  //           --jh-bg5 : var(--jh-rx-${color}5);
  //           --jh-bg4 : var(--jh-rx-${color}4);
  //           --jh-bg3 : var(--jh-rx-${color}3);
  //           --jh-bg2 : var(--jh-rx-${color}2);
  //           --jh-bg1 : var(--jh-rx-${color}1);
  //           --jh-rx-${color}10: ${theme.colors[`${color}10`]};
  //           --jh-rx-${color}9: ${theme.colors[`${color}9`]};
  //           --jh-rx-${color}8: ${theme.colors[`${color}8`]};
  //           --jh-rx-${color}7: ${theme.colors[`${color}7`]};
  //           --jh-rx-${color}6: ${theme.colors[`${color}6`]};
  //           --jh-rx-${color}5: ${theme.colors[`${color}5`]};
  //           --jh-rx-${color}4: ${theme.colors[`${color}4`]};
  //           --jh-rx-${color}3: ${theme.colors[`${color}3`]};
  //           --jh-rx-${color}2: ${theme.colors[`${color}2`]};
  //           --jh-rx-${color}1: ${theme.colors[`${color}1`]};
  //         }
  //         `;
  //   },
  // ],
];

export const shortcuts = [
  {
    field: 'px-2 py-1 rd-2 bg-base2 focus:bg-base2 b-1 b-base6 focus:b-base7',
    label: 'fw-600 uppercase ls-widest text-xs c11 ',
    jc: 'justify-center',
    ac: 'items-center',
    btn: `p-2 px-4 rd-2 b-1 
    b-base6 hover:b-base7 active:b-base7
    bg-base2A hover:bg-base3A active:bg-base4A
    focus-visible:outline-accent11
    focus:outline-accent11
    disabled:( c-base11 bg-base11 bg8 b-gray b6)`,
    'icon-btn': `p-2 px-2 rd-2 b-1 
     flex justify-center items-center
     b-base6 hover:b-base7 active:b-base7 
     bg-base2A hover:bg-base3A active:bg-base4A
    focus-visible:outline-accent11
    disabled:( c-base11 bg-base11 bg8 b-gray b6)`,
    'btn-ghost': `b-1 b-mauve b7  c11 bg-blue px-4 py-2 rd-2 fw-500
         active:(b8 bg1) 
         hover:(b8  bg1)
         focus:(b8  bg1)
         disabled:(c-gray c11 bg-gray bg8 b-gray b6)`,
    'btn-text': `b-1 bg-blue fw-500 px-4 py-2 rd-2 b-transparent bg-transparent
         hover:(bg-blue bg2 b-blue b6)
         focus:(bg-blue bg2 b-blue b2)
         active:(bg-blue bg3 b-blue b3)
         disabled:(c-gray c11 bg-gray bg8 b-gray b6)`,
    snack:
      'b-1 b6 b-l-4 bg3 c11 rd-2 p-4 pis-12 rel isolate before:(inline-block content-none  vertical-text-top abs top-5 left-4)',
    'snack-info': 'b-blue c-blue bg-blue  before:i-ph-info',
    'snack-warning': 'b-yellow c-yellow bg-yellow  before:i-ph-warning',
    'snack-success': 'b-yellow c-green bg-green  before:i-ph-check-circle',
    'snack-error': 'b-red c-red bg-red  before:i-ph-x-circle',
    'snack-danger': 'b-red c-red bg-red  before:i-ph-warning-octagon',
    'info-line': 'bf-i-ph-info before:c-blue11 before:opacity-100 text-sm c-blue10 ',
    'success-line': 'bf-i-ph-check-circle before:c-green11 before:opacity-100 text-sm c-green10',
    'warning-line': 'bf-i-ph-warning before:c-yellow11 before:opacity-100 text-sm c-yellow10',
    'error-line': 'bf-i-ph-x-circle before:c-red11 before:opacity-100 text-sm c-red10',
    'danger-line': 'bf-i-ph-warning-octagon before:c-red11 before:opacity-100 text-sm c-red10',
    H1: 'text-4xl fw-700  font-display',
    H2: 'text-3xl fw-700  font-display',
    H3: 'text-xl fw-700  font-display ',
    H4: 'fw-700  font-display',
  },
  [
    /^bf-i-(.*)$/,
    ([, iconName]: string[]) =>
      `before:opacity-40 before:mie-1 empty:before:mie-0 before:vertical-middle before:scale-120 -before:translate-y-0.25  before:content-none before:inline-block before:i-${iconName}`,
  ],
  [
    /^af-i-(.*)$/,
    ([, iconName]: string[]) =>
      `after:opacity-40 after:mis-1 empty:after:mis-0 after:vertical-middle after:scale-120 -after:translate-y-0.25 after:content-none after:inline-block after:i-${iconName}`,
  ],
  [/^ol-(.*)$/, ([, val]: string[]) => `outline-${val}`],
  [/^r-(.*)$/, ([, val]: string[]) => `r-${val}`],
];
