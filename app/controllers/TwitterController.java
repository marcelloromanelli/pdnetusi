/**
 * 
 */
package controllers;

import java.util.ArrayList;
import java.util.HashMap;

import org.codehaus.jackson.JsonNode;
import org.codehaus.jackson.node.ObjectNode;


import play.Logger;
import play.libs.Json;
import play.libs.F.Callback;
import play.libs.F.Callback0;
import play.mvc.Controller;
import play.mvc.WebSocket;
import play.mvc.WebSocket.Out;
/**
 * @author romanelm
 */
public class TwitterController extends Controller {

	/**
	 * Hashmap that given an ID of a Display, returns 
	 * a Sockets object containing 2 websockets: one for the small view
	 * and one for the big one.	
	 */
	public static HashMap<String, Sockets> sockets = new HashMap<String, Sockets>();

	public static HashMap<String,ArrayList<WebSocket.Out<JsonNode>>> mobilesConnected = new HashMap<String, ArrayList<Out<JsonNode>>>(); 
	public static HashMap<WebSocket.Out<JsonNode>,String> reverter = new HashMap<WebSocket.Out<JsonNode>, String>();

	public static WebSocket<JsonNode> webSocket() {
		return new WebSocket<JsonNode>() {

			// Called when the Websocket Handshake is done.
			public void onReady(WebSocket.In<JsonNode> in, final WebSocket.Out<JsonNode> out) {

				in.onMessage(new Callback<JsonNode>() {
					public void invoke(JsonNode event) {
						Logger.info("INCOMING MESSAGE ON Twitter WS:\n" + event.toString());
						String messageKind = event.get("kind").asText();						
						String displayID = event.get("displayID").asText();


						if(messageKind.equals("appReady")){

							if(!sockets.containsKey(displayID)){
								sockets.put(displayID, new Sockets(null, null));
								mobilesConnected.put(displayID,new ArrayList<WebSocket.Out<JsonNode>>());
								Logger.info("DisplayID " + displayID + " was added to the instagram app.");
							}


							String size = event.get("size").asText();
							if(size.equals("small")){
								// Set the socket
								sockets.get(displayID).small = out;
							} else if(size.equals("big")) {
								sockets.get(displayID).big  = out;
							}

						} else if (messageKind.equals("mobileRequest")){
							if(! mobilesConnected.get(displayID).contains(out)){
								reverter.put(out, displayID);
								mobilesConnected.get(displayID).add(out);
							}
							int numberOfMobiles = mobilesConnected.get(displayID).size() ;
							Sockets dsock = sockets.get(displayID);
							
							
							ObjectNode stats = Json.newObject();
							stats.put("kind", "stats");
							stats.put("mobiles", numberOfMobiles);
							dsock.big.write(stats);
							dsock.small.write(stats);

							Logger.info(numberOfMobiles + " mobiles connected");
						}
					}
				});


				// When the socket is closed.
				in.onClose(new Callback0() {
					public void invoke() {
						String displayID = reverter.get(out);
						mobilesConnected.get(displayID).remove(out);
						reverter.remove(out);
						Logger.info("MOBILE REMOVED!");
						Logger.info(mobilesConnected.get(displayID).size() + " mobiles connected");
					}


				});

			}

		};
	}

	public static class Sockets {
		public WebSocket.Out<JsonNode> small;
		public WebSocket.Out<JsonNode> big;

		public Sockets(Out<JsonNode> small, Out<JsonNode> big) {
			this.small = small;
			this.big = big;
		}
	}

}
