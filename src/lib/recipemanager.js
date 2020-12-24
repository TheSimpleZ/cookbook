

export function createRecipe({ user }) {
  return { roles: { [user.uid]: 'owner' }, }
}