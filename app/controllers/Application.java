	package controllers;

import models.Display;
import models.DisplayLayout;
import play.mvc.Controller;
import play.mvc.Result;
import views.html.index;
import views.html.manager;

public class Application extends Controller {

	/**
	 * Display the home page.
	 */
	public static Result index() {
		return ok(index.render(Display.all()));
	}

	public static Result manager() {
		return ok(manager.render(Display.all(),DisplayLayout.all()));
	}
}
