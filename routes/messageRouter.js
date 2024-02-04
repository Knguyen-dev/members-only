const router = require("express").Router();
const messageController = require("../controllers/messageController");
const auth = require("../middleware/auth");
/*
+ We need auth before we can do this
*/

// Making a message
router.get("/create", auth.handleIsAuth, messageController.message_create_get);
router.post("/create", messageController.message_create_post);

router.get(
	"/:id/update",
	auth.handleIsAuth,
	messageController.message_update_get
);
router.post("/:id/update", messageController.message_update_post);

/*
+ Admin message deletion route: If the user isn't an admin the link to delete a message won't be shown. However if somehow 
  the user typed in the deletion route, then they'd be redirected to the admin register page. Effectively preventing the 
  delete request from happening

- Html forms don't do post requests natively, so remember we just use a post request that deletes data. 
*/
router.post(
	"/:id/delete",
	auth.handleIsAdmin,
	messageController.message_delete_post
);


module.exports = router;
