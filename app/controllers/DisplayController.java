package controllers;

import java.util.HashMap;
import java.util.Map;

import models.Display;

import org.codehaus.jackson.JsonNode;
import org.codehaus.jackson.node.ObjectNode;

import play.Logger;
import play.data.Form;
import play.libs.F.Callback;
import play.libs.F.Callback0;
import play.mvc.BodyParser;
import play.mvc.BodyParser.Json;
import play.mvc.Controller;
import play.mvc.Result;
import play.mvc.WebSocket;

public class DisplayController extends Controller {

	public static HashMap<String, WebSocket.Out<JsonNode>> activeDisplays = new HashMap<String, WebSocket.Out<JsonNode>>();
	public static HashMap<WebSocket.Out<JsonNode>, String> outToID = new HashMap<WebSocket.Out<JsonNode>, String>();

	/**
	 * Prepare the display with the tiles selected during
	 * the layout creation
	 * @param displayID
	 * @return
	 */
	public static Result setupDisplay(String displayID) {
		if(!activeDisplays.containsKey(displayID)){
			Display display = Display.get(new Long(displayID));
			String name = display.name;
			activeDisplays.put(displayID, null);
			return ok(views.html.display.render(displayID,name));
		} else {
			return ok("SORRY, DISPLAY ID " + displayID + " IS ALREADY ACTIVE");
		}
	}



	@BodyParser.Of(Json.class)
	public static Result updateDisplayInformations(){
		JsonNode json = request().body().asJson();

		if(json == null) {
			return badRequest("Expecting Json data");
		} 
		else {
			String kind = json.get("kind").asText();
			ObjectNode result = play.libs.Json.newObject();

			if(kind.equals("linking")){
				Long layoutid = new Long(json.get("layoutid").asText());
				Long currentSelected =new Long(json.get("currentSelected").asText());

				Display.updateLayout(layoutid, currentSelected);
				
				result.put("layoutid", layoutid);
				result.put("currentSelected", currentSelected);
				return ok(result);
			} else if(kind.equals("update")){
				
				Long displayid = json.get("displayid").asLong();
				String name = json.get("name").asText();
				Integer width = json.get("width").asInt();
				Integer height = json.get("height").asInt();
				Float latitude = new Float(json.get("latitude").asText());
				Float longitude = new Float(json.get("longitude").asText());
				
				Display clone = (Display) Display.find.byId(displayid)._ebean_createCopy();
				clone.name = name;
				clone.width = width;
				clone.height = height;
				clone.latitude = latitude;
				clone.longitude = longitude;
				
				Display.delete(displayid);
				Display.addNew(clone);
				
				result.put("id", clone.id);
				result.put("name", clone.name);
				result.put("width", clone.width);
				result.put("height", clone.height);
				result.put("latitude", clone.latitude);
				result.put("longitude", clone.longitude);
				result.put("layoutid", clone.currentLayoutID);

				return ok(result);
			} 
		}
		
		return badRequest();
	}

	@BodyParser.Of(Json.class)
	public static Result removeDisplay(){
		JsonNode json = request().body().asJson();

		if(json == null) {
			return badRequest("Expecting Json data");
		} 
		else {
			Long currentSelected =new Long(json.get("currentSelected").asText());

			Display.delete(currentSelected);
			ObjectNode result = play.libs.Json.newObject();
			result.put("removedid", currentSelected);
			return ok(result);
		}
	}
	
	@BodyParser.Of(Json.class)
	public static Result newDisplay(){
		JsonNode json = request().body().asJson();

		if(json == null) {
			return badRequest("Expecting Json data");
		} 
		else {
			Logger.info(json.toString());
			String name = json.get("name").asText();
			String width = json.get("width").asText();
			String height = json.get("height").asText();
			String latitude = json.get("latitude").asText();
			String longitude = json.get("longitude").asText();
			
			Form<Display> filledForm = form(Display.class);
			Map<String,String> anyData = new HashMap<String, String>();
			anyData.put("name", name);
			anyData.put("width", width);
			anyData.put("height", height);
			anyData.put("latitude", latitude);
			anyData.put("longitude", longitude);
			
			Logger.info(anyData.toString());
			
			
			Display display = filledForm.bind(anyData).get();
			Display res = Display.addNew(display);
			
			ObjectNode result = play.libs.Json.newObject();
			result.put("id", res.id);
			result.put("name", name);
			result.put("width", width);
			result.put("height", height);
			result.put("latitude", latitude);
			result.put("longitude", longitude);
			return ok(result);
		}
	}

	public static WebSocket<JsonNode> webSocket() {
		return new WebSocket<JsonNode>() {
			@Override
			public void onReady(WebSocket.In<JsonNode> in, final WebSocket.Out<JsonNode> out) {
				in.onMessage(new Callback<JsonNode>() {
					public void invoke(JsonNode event) {
						String displayID = event.get("displayID").asText();
						activeDisplays.put(displayID, out);
						outToID.put(out, displayID);
						Logger.info(
								"\n ******* MESSAGE RECIEVED *******" +
										"\n Display " + displayID + "is now active." +
										"\n*********************************"
								);
					}
				});

				// When the socket is closed.
				in.onClose(new Callback0() {
					public void invoke() {
						String displayID = outToID.get(out);
						outToID.remove(out);
						activeDisplays.remove(displayID);
						Logger.info(
								"\n ******* MESSAGE RECIEVED *******" +
										"\n Display " + displayID + "is now disconnected." +
										"\n*********************************"
								);
					}


				});

			}

		};
	}
}

