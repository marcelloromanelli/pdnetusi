	package controllers;

import models.Display;
import play.mvc.Controller;
import play.mvc.Result;
import views.html.index;

public class Application extends Controller {

	/**
	 * Display the home page.
	 */
	public static Result index() {
		return ok(index.render(Display.all()));
	}

}
