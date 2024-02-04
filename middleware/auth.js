const handleIsAuth = (req, res, next) => {
	if (req.isAuthenticated()) {
		next();
	} else {
		res.redirect("/auth/login");
	}
};

const handleIsAdmin = (req, res, next) => {
	if (req.user.role === "admin") {
		next();
	} else {
		res.redirect("/admin_register");
	}
};

module.exports = {
	handleIsAuth,
	handleIsAdmin,
};
