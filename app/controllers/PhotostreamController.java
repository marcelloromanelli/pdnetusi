/**
 * 
 */
package controllers;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.Map;

import org.codehaus.jackson.JsonNode;
import org.codehaus.jackson.node.ObjectNode;

import play.Logger;
import play.libs.Json;
import play.libs.F.Callback;
import play.libs.F.Callback0;
import play.mvc.Controller;
import play.mvc.WebSocket;
/**
 * @author romanelm
 */
public class PhotostreamController extends Controller {


	public static Map<String, ArrayList<WebSocket.Out<JsonNode>>> freeTiles = new HashMap<String, ArrayList<WebSocket.Out<JsonNode>>>();
	// Tells the displayID given a websocket out
	public static Map<WebSocket.Out<JsonNode>,String> fromWStoDisplayID = new HashMap<WebSocket.Out<JsonNode>, String>();
	// Tells the Tile specifications given a websocket out
	public static Map<WebSocket.Out<JsonNode>,PhotostreamController.Tile> fromWStoTile = new HashMap<WebSocket.Out<JsonNode>,PhotostreamController.Tile>();

	// Tiles already used for dafault requests
	public static ArrayList<WebSocket.Out<JsonNode>> usedDefaultTiles = new ArrayList<WebSocket.Out<JsonNode>>();

	public static WebSocket<JsonNode> webSocket() {
		return new WebSocket<JsonNode>() {

			// Called when the Websocket Handshake is done.
			public void onReady(WebSocket.In<JsonNode> in, final WebSocket.Out<JsonNode> out) {

				in.onMessage(new Callback<JsonNode>() {
					public void invoke(JsonNode event) {
						Logger.info("A MESSAGE!");
						Logger.info(event.toString());
						String messageKind = event.get("kind").asText();						
						String displayID = event.get("displayID").asText();

						if(messageKind.equals("tileAvailable")){

							String width = event.get("width").asText();
							String height  = event.get("height").asText();

							Logger.info(
									"\n ******* MESSAGE RECIEVED *******" +
											"\n New photostream tile available on " + displayID +
											"\n SIZE: (" + width + "," + height + ")" +
											"\n*********************************"
									);

							saveTile(out, displayID, width, height);

						} else if(messageKind.equals("mobileRequest")){
							String username = event.get("username").asText();
							String location = event.get("preference").asText();
							processInput(displayID, username, location, false);
						} else if(messageKind.equals("defaultRequest")){
							String prefs = event.get("preference").asText();
							processInput(displayID, "default", prefs, true);
						}else {
							Logger.info("WTF: " + event.toString());
						}

					}

					private void processInput(String displayID,String username, String prefs, boolean isDefault) {
						try {
							Out<JsonNode> tileOut = null;
							if(isDefault){
								tileOut = findDefaultDestinationTile(displayID,0,0);
							} else{
								tileOut = findDestinationTile(displayID,0,0);
							}

							if (tileOut == null){
								Logger.info("SORRY NO SPACE");
								// ADD TO A QUEUE?
							} 
							else {
								Logger.info(
										"\n ******* MESSAGE RECIEVED *******" +
												"\n" + username + " on " + displayID +
												"\nwants images" +
												"\n*********************************"
										);

								
								//PhotostreamController.Tile tile = fromWStoTile.get(tileOut);
								
								ObjectNode response = Json.newObject();
								response.put("imgs", prefs);
								tileOut.write(response);
								
								if(!isDefault){
									removeTileFromAvailable(tileOut);
								}
							}

						} catch (Exception e) {
							e.printStackTrace();
						}
					}

					private void saveTile(final WebSocket.Out<JsonNode> out,String displayID, String width, String height) {
						if(freeTiles.containsKey(displayID)){
							freeTiles.get(displayID).add(out);
						} else {
							ArrayList<WebSocket.Out<JsonNode>> outs = new ArrayList<WebSocket.Out<JsonNode>>();
							outs.add(out);
							freeTiles.put(displayID, outs);
						}
						fromWStoDisplayID.put(out, displayID);
						fromWStoTile.put(out, new PhotostreamController.Tile(new Integer(width), new Integer(height)));
					}

				});

				// When the socket is closed.
				in.onClose(new Callback0() {
					public void invoke() {
						String displayID = removeTileFromAvailable(out);
						Logger.info("\n ******* MESSAGE RECIEVED *******" +
								"\n A photostream tile on " + displayID +
								"\n is now disconnected." +
								"\n*********************************"
								);
					}


				});

			}

		};
	}


	/**
	 * Find the socket of a tile within the given constraint of width and height. Later
	 * removes it from the available tiles
	 * @param displayID
	 * @param minWidth
	 * @param minHeight
	 * @return
	 */
	public static WebSocket.Out<JsonNode> findDestinationTile(String displayID, Integer minWidth, Integer minHeight){
		ArrayList<WebSocket.Out<JsonNode>> outs = freeTiles.get(displayID);
		Iterator<WebSocket.Out<JsonNode>> it = outs.iterator();
		while (it.hasNext()){
			WebSocket.Out<JsonNode> out = it.next();
			Tile currentTile = fromWStoTile.get(out);
			if(currentTile.width >= minWidth && currentTile.height >= minHeight){
				usedDefaultTiles.add(out);
				return out;
			}

		}	
		return null;
	}

	public static WebSocket.Out<JsonNode> findDefaultDestinationTile(String displayID, Integer minWidth, Integer minHeight){
		ArrayList<WebSocket.Out<JsonNode>> outs = freeTiles.get(displayID);
		Iterator<WebSocket.Out<JsonNode>> it = outs.iterator();
		while (it.hasNext()){
			WebSocket.Out<JsonNode> out = it.next();
			if(!usedDefaultTiles.contains(out)){
				Tile currentTile = fromWStoTile.get(out);
				if(currentTile.width >= minWidth && currentTile.height >= minHeight){
					usedDefaultTiles.add(out);
					return out;
				}
			}
		}	
		return null;
	}

	public static String removeTileFromAvailable(final WebSocket.Out<JsonNode> out) {
		String displayID = fromWStoDisplayID.get(out);
		freeTiles.get(displayID).remove(out);
		fromWStoDisplayID.remove(out);
		fromWStoTile.remove(out);
		return displayID;
	}

	public static class Tile {
		final Integer width;
		final Integer height;

		public Tile(Integer width, Integer height) {
			this.width = width;
			this.height = height;
		}		
	} 

}
