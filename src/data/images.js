import profile from '../assets/profile.webp'
import avatar from '../assets/avatar.webp'

const shots = import.meta.glob('../assets/projects/*.webp', { eager: true, query: '?url', import: 'default' })

/** Resolve a project screenshot by name (without extension). */
export const projectImage = (name) => shots[`../assets/projects/${name}.webp`]
export { profile, avatar }
