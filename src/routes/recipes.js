import get from './_recipeDb'


export async function get(req, res, next) {

	const recipes = get();

	if (recipes !== null) {
    res.setHeader('Content-Type', 'application/json');
    console.log(recipes)
		res.end(JSON.stringify(recipes));
	} else {
		next();
	}
}