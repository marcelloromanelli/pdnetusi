	package controllers;

import models.Display;
import play.mvc.Controller;
import play.mvc.Result;

public class Application extends Controller {

	/**
	 * Display the home page.
	 */
	public static Result index() {
		return ok(views.html.index.render(Display.all()));
	}

}
