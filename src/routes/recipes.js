import {db} from "../store/firebase";

export async function get(req, res, next) {

	const data = await db
		.collection("recipes")
		.get();
		
		
	if (!data.empty) {
    res.setHeader('Content-Type', 'application/json');
		res.end(JSON.stringify(data.docs[0].data()));
	} else {
		next();
	}
}