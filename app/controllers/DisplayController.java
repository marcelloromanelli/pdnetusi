package controllers;

import java.util.List;

import models.Display;
import models.DisplayLayout;
import models.Tile;
import play.Logger;
import play.data.Form;
import play.mvc.Controller;
import play.mvc.Result;
import views.html.*;

public class DisplayController extends Controller {

	
	/**
	 * Prepare the display with the tiles selected during
	 * the layout creation
	 * @param displayID
	 * @return
	 */
	public static Result setupDisplay(String displayID) {
		Display display = Display.get(new Long(displayID));
		String name = display.name;
		Logger.info("Enabling display " + name + "(" +  displayID + ")...");
		List<Tile> tiles = Tile.layoutTiles(display.currentLayoutID);
		return ok(views.html.display.render(displayID,name,tiles));
	}
	
	
	static Form<Display> displayRegistrationForm = form(Display.class);

	
	/**
	 * Receives the input from a form, binds it and enters it
	 * into a database.
	 * @return
	 */
	public static Result registerDisplay(){
		Form<Display> filledForm = displayRegistrationForm.bindFromRequest();
		if(filledForm.hasErrors()) {
			return badRequest(displayManager.render(Display.all(), filledForm, DisplayLayout.all()));
		} else {
			Logger.info("DISPLAY CONTROLLER: \n" +
					filledForm.get().name 
					+ " has been added to the database with layout " + filledForm.get().currentLayoutID 
					);
			Display.addNew(filledForm.get());
			return redirect(routes.DisplayController.showAvailableDisplays());  
		}
	}
	
	/**
	 * Render the default view with all the displays
	 * @return
	 */
	public static Result showAvailableDisplays(){
		return ok(displayManager.render(Display.all(), displayRegistrationForm, DisplayLayout.all()));
	}
	
	/**
	 * Remove a display from the database
	 * @param displayID
	 * @return
	 */
	public static Result deleteDisplay(Long displayID){
		Display.delete(displayID);
		return redirect(routes.DisplayController.showAvailableDisplays());
	}
	
}
