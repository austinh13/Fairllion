// The kind of country a hole is laid out in. Purely cosmetic: it changes the
// ground, the trees and the scenery, never the yardages.

/**
 * rough, semi, stone, dirt…  recolour the ground (the rest comes from the palette)
 * hills      how much the land either side rolls (1 is parkland)
 * trees      how thickly trees grow (1 is parkland)
 * pines      share of the trees that are pines
 * cactus     trees are cacti
 * palm       trees are palms
 * leaves     canopy colours, light to dark (otherwise the mood's)
 * water      water colour (otherwise the mood's)
 * heather    purple heather grows in patches through the rough
 * snow       high ground is under snow
 * bush       colours of a bush: body, top
 * blooms     colours of the wild flowers
 */
export const SETTINGS = {
  parkland: { key: 'parkland', name: 'Parkland', hills: 1, trees: 1, pines: 0.22 },
  links: {
    key: 'links', name: 'Links',
    rough: '#a3a556', semi: '#8cb24d', pineGround: '#8f9a4c', stone: '#b9ad8a', stoneDark: '#9c9172',
    hills: 1.7, trees: 0.1, pines: 0.1,
    bush: ['#4f7a35', '#e2c234'], blooms: ['#e2c234', '#ffffff', '#f0dca2'],
  },
  heath: {
    key: 'heath', name: 'Heathland',
    rough: '#74924a', semi: '#74a846',
    hills: 1.15, trees: 0.5, pines: 0.65, heather: true,
    bush: ['#7b5191', '#9d6aaa'], blooms: ['#c9a2f2', '#ffffff', '#9d6aaa'],
  },
  alpine: {
    key: 'alpine', name: 'Mountain',
    rough: '#5a8f4a', stone: '#8b8f96', stoneDark: '#6c7078',
    hills: 1.5, trees: 1.25, pines: 0.9, snow: true,
    blooms: ['#ffffff', '#8fb8f2', '#ffd84a'],
  },
  desert: {
    key: 'desert', name: 'Desert',
    rough: '#d3a765', semi: '#8aa94a', pineGround: '#c4955a', stone: '#b9643c', stoneDark: '#96492b',
    dirt: '#a86238', dirtDark: '#8a4b2a', shore: '#e6c98f', shoreDark: '#cfae76',
    hills: 1.35, trees: 0.45, pines: 0, cactus: true,
    bush: ['#8a9a55', '#a9b56a'], blooms: ['#f2643c', '#ffd84a', '#f5a3c4'],
  },
  tropical: {
    key: 'tropical', name: 'Tropical coast',
    rough: '#56a84c', semi: '#6fbb4e', sand: '#fbf3dc', sandDark: '#eadfbd', shore: '#f6ecd0', shoreDark: '#e6d9b4',
    water: '#27bcc4', hills: 0.8, trees: 0.6, pines: 0, palm: true,
    leaves: ['#5fbf58', '#3fa04c', '#2f8443'],
    bush: ['#2f8443', '#f2643c'], blooms: ['#f2643c', '#ff9ec4', '#ffd84a'],
  },
  garden: {
    key: 'garden', name: 'Blossom garden',
    rough: '#6aa84f', hills: 0.9, trees: 0.95, pines: 0.12,
    leaves: ['#f9cfe0', '#f2a3c3', '#e37ea9'],
    bush: ['#4f9140', '#f2a3c3'], blooms: ['#f9cfe0', '#ffffff', '#f2a3c3'],
  },
  winter: {
    key: 'winter', name: 'Winter fell',
    rough: '#e6ecef', pineGround: '#d5dde2', semi: '#9fc48f', stone: '#8b8f96', stoneDark: '#6c7078',
    shore: '#f4f7f9', shoreDark: '#dfe6ea', water: '#8fbfd8',
    hills: 1.4, trees: 0.8, pines: 0.7, snow: true,
    leaves: ['#f3f6f8', '#d8e1e7', '#b7c5cf'],
    bush: ['#b7c5cf', '#f3f6f8'], blooms: ['#ffffff', '#cfe3f2'],
  },
};

/** Courses are named for their country: "Thornwick Links" is a links. */
const BY_NAME = {
  Links: 'links', Dunes: 'links',
  Heath: 'heath', Moor: 'heath',
  Hills: 'alpine', Pines: 'alpine',
  Mesa: 'desert',
  Bay: 'tropical', Cove: 'tropical',
  Garden: 'garden',
  Fell: 'winter',
};

export function settingKeyFor(courseName) {
  return BY_NAME[String(courseName).split(' ').at(-1)] || 'parkland';
}

export function settingOf(hole) {
  return SETTINGS[hole.setting] || SETTINGS.parkland;
}
