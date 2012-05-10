/**
 * 
 */
package controllers;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.net.URL;
import java.net.URLConnection;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.Map;

import org.codehaus.jackson.JsonNode;
import org.codehaus.jackson.map.ObjectMapper;
import org.codehaus.jackson.node.ObjectNode;

import play.Logger;
import play.libs.F.Callback;
import play.libs.F.Callback0;
import play.libs.Json;
import play.mvc.Controller;
import play.mvc.WebSocket;
/**
 * @author romanelm
 */
public class NewsFeedController extends Controller {

	// Tells the tiles given a displayID
	public static Map<String, ArrayList<WebSocket.Out<JsonNode>>> freeTiles = new HashMap<String, ArrayList<WebSocket.Out<JsonNode>>>();
	// Tells the displayID given a websocket out
	public static Map<WebSocket.Out<JsonNode>,String> fromWStoDisplayID = new HashMap<WebSocket.Out<JsonNode>, String>();
	// Tells the Tile specifications given a websocket out
	public static Map<WebSocket.Out<JsonNode>,NewsFeedController.Tile> fromWStoTile = new HashMap<WebSocket.Out<JsonNode>,NewsFeedController.Tile>();

	public static WebSocket<JsonNode> webSocket() {
		return new WebSocket<JsonNode>() {

			// Called when the Websocket Handshake is done.
			public void onReady(WebSocket.In<JsonNode> in, final WebSocket.Out<JsonNode> out) {

				in.onMessage(new Callback<JsonNode>() {
					public void invoke(JsonNode event) {
						String messageKind = event.get("kind").asText();						
						String displayID = event.get("displayID").asText();

						if(messageKind.equals("tileAvailable")){

							String width = event.get("width").asText();
							String height  = event.get("height").asText();

							Logger.info(
									"\n ******* MESSAGE RECIEVED *******" +
											"\n New newsfeed tile available on " + displayID +
											"\n SIZE: (" + width + "," + height + ")" +
											"\n*********************************"
									);

							saveTile(out, displayID, width, height);

						} else if(messageKind.equals("mobileRequest")){
							String username = event.get("username").asText();
							Logger.info("MOBILE: \n " + username + " on " + displayID + " request feeds");

							Out<JsonNode> tileOut = findDestinationTile(displayID,0,0);

							JsonNode feeds = event.get("feeds");
							ArrayList<String> feedsTitles = new ArrayList<String>();
							Iterator<JsonNode> it = feeds.getElements();
							while(it.hasNext()){
								JsonNode jsonFeed = xmlJsonObject(it.next().asText()).get("responseData").get("feed");
								Logger.info("PROCESSING: " + jsonFeed.get("title"));
								Iterator<JsonNode> entries = jsonFeed.get("entries").getElements();
								while(entries.hasNext()){
									JsonNode currentEntry = entries.next();
									feedsTitles.add(currentEntry.get("title").asText());
								}
							}
							ObjectNode response = Json.newObject();
							JsonNode jsonFeedsTitles = Json.toJson(feedsTitles);
							response.put("feeds", jsonFeedsTitles);
							tileOut.write(response);
						} else {
							Logger.info("WTF: " + event.toString());
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
						fromWStoTile.put(out, new NewsFeedController.Tile(new Integer(width), new Integer(height)));
					}

				});

				// When the socket is closed.
				in.onClose(new Callback0() {
					public void invoke() {
						String displayID = removeTileFromAvailable(out);
						Logger.info(
								"\n ******* MESSAGE RECIEVED *******" +
								"\n A newsfeed tile on " + displayID +
								"\n is now disconnected." +
								"\n*********************************"
								);
					}


				});

			}

		};
	}

	protected static JsonNode xmlJsonObject(String feedURL) {
		String baseURL = "https://ajax.googleapis.com/ajax/services/feed/load?v=1.0&q=";
		try {
			URL url = new URL(baseURL + feedURL);
			URLConnection connection = url.openConnection();

			String line;
			StringBuilder builder = new StringBuilder();
			BufferedReader reader = new BufferedReader(new InputStreamReader(connection.getInputStream()));
			while((line = reader.readLine()) != null) {
				builder.append(line);
			}

			ObjectMapper mapper = new ObjectMapper();
			JsonNode df = mapper.readValue(builder.toString(), JsonNode.class);

			return df;
		} catch (Exception e) {
			e.printStackTrace();
		}
		return null;
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
				return out;
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
