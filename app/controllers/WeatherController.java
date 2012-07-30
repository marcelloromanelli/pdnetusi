/**
 * 
 */
package controllers;

import java.util.ArrayList;
import java.util.HashMap;

import org.codehaus.jackson.JsonNode;

import play.Logger;
import play.libs.F.Callback;
import play.libs.F.Callback0;
import play.mvc.Controller;
import play.mvc.WebSocket;
/**
 * @author romanelm
 */
public class WeatherController extends Controller {

	public static Integer MAX_REQUEST = 3;
	
	public static HashMap<String, ArrayList<WebSocket.Out<JsonNode>>> sockets = new HashMap<String, ArrayList<WebSocket.Out<JsonNode>>>();

	
	public static WebSocket<JsonNode> webSocket() {
		return new WebSocket<JsonNode>() {

			// Called when the Websocket Handshake is done.
			public void onReady(WebSocket.In<JsonNode> in, final WebSocket.Out<JsonNode> out) {

				in.onMessage(new Callback<JsonNode>() {
					public void invoke(JsonNode event) {
						Logger.info("MESSAGE FOR WEATHER WS");
						Logger.info(event.toString());
						String messageKind = event.get("kind").asText();						
						String displayID = event.get("displayID").asText();

						if(messageKind.equals("appReady")){

							String size = event.get("size").asText();

							Logger.info(
									"\n ******* MESSAGE RECIEVED *******" +
											"\n The "+ size + " view of \n" +
											"weather app is now available on displayID: " + displayID +
											"\n*********************************"
									);

						} else if(messageKind.equals("mobileRequest")){
							String username = event.get("username").asText();
							String location = event.get("preference").asText();
//							processInput(displayID, username, location, false);
						} else if(messageKind.equals("defaultRequest")){
							String location = event.get("preference").asText();
//							processInput(displayID, "default", location, true);
						}else {
							Logger.info("WTF: " + event.toString());
						}

					}

				
				});

				// When the socket is closed.
				in.onClose(new Callback0() {
					public void invoke() {
						Logger.info("\n ******* MESSAGE RECIEVED *******" +
								"\n A weather tile on " + "FILL" +
								"\n is now disconnected." +
								"\n*********************************"
								);
					}


				});

			}

		};
	}



}
