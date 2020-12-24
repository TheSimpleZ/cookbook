

export function createRecipe({ user }) {
  return { roles: { [user.id]: 'owner' }, }
}