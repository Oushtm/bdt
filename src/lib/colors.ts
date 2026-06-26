export const colors = {
  bg:        '#FFF8FC',
  pink:      '#FF7EB6',
  pinkLight: '#FFC4DD',
  lavender:  '#DCC8FF',
  cream:     '#FFF6E8',
  gold:      '#FFD166',
  text:      '#3D3142',
  success:   '#7ED6A7',
} as const;

export type ColorKey = keyof typeof colors;
