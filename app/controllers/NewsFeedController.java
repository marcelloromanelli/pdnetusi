
package controllers;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.net.URL;
import java.net.URLConnection;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;

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


	/**
	 * Hashmap that given an ID of a Display, returns 
	 * an list of 2 websockets: one for the small view
	 * and one for the big one.	
	 * Position 0: small
	 * Position 1: big
	 */
	public static HashMap<String, ArrayList<WebSocket.Out<JsonNode>>> sockets = 
			new HashMap<String, ArrayList<WebSocket.Out<JsonNode>>>();

	/**
	 * Hashmap that given an ID of a Display, returns 
	 * how many request the application can still recieve
	 */
	public static HashMap<String,Integer> status = 
			new HashMap<String, Integer>();

	/**
	 * The number of maximum request must be multiplied
	 * by two because we have a SMALL and a BIG view 
	 */
	public static Integer MAX_REQ = 10*2;

	public static WebSocket<JsonNode> webSocket() {
		return new WebSocket<JsonNode>() {

			// Called when the Websocket Handshake is done.
			public void onReady(WebSocket.In<JsonNode> in, final WebSocket.Out<JsonNode> out) {

				in.onMessage(new Callback<JsonNode>() {
					public void invoke(JsonNode event) {

						Logger.info("INCOMING MESSAGE ON NEWSFEED WS:\n" 
						+ event.toString());

						String messageKind = event.get("kind").asText();						
						String displayID = event.get("displayID").asText();

						if(!sockets.containsKey(displayID)){
							sockets.put(displayID, new ArrayList<WebSocket.Out<JsonNode>>());
							status.put(displayID, MAX_REQ);
							Logger.info("DisplayID " + displayID + " was added to the system.");
						}

						if(messageKind.equals("appReady")){
							
							Logger.info("Newsfeed app is ready!");
							
							// Can be either small or big
							String size = event.get("size").asText();
							
							if(size.equals("small")){
								sockets.get(displayID).add(0, out);
								Logger.info("SMALL WS ADDED");
							} else if(size.equals("big")) {
								Logger.info("BIG WS ADDED");
								sockets.get(displayID).add(1, out);
								Logger.info("BIG WS ADDED");
							}

							Logger.info(
									"\n ******* MESSAGE RECIEVED *******" +
											"\n The "+ size + " view of \n" +
											"newsfeed app is now available on displayID: " + displayID +
											"\n*********************************"
									);

							Logger.info("wella");

						} else if(messageKind.equals("mobileRequest")){
							String username = event.get("username").asText();
							JsonNode feeds = event.get("preference");
							extractTitles(feeds);
						} else {
							Logger.info("WTF: " + event.toString());
						}

					}

				});

				// When the socket is closed.
				in.onClose(new Callback0() {
					public void invoke() {
						Logger.info("\n ******* MESSAGE RECIEVED *******" +
								"\n A weather tile on " + "TODO" +
								"\n is now disconnected." +
								"\n*********************************"
								);
					}


				});

			}

		};
	}
	
	public static JsonNode xmlToJSON(String feedURL) {
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
	 * Given a JSON containing a set of feeds sources,
	 * it returns a new JSON containing the titles of the various
	 * news.
	 * @param json of feeds recieved from the mobile 
	 * @return
	 */
	public static ObjectNode extractTitles(JsonNode feeds) {
		Logger.info("here");
		
		JsonNode hot = feeds.get("hot");
		JsonNode tech = feeds.get("tech");
		JsonNode sport = feeds.get("sport");
		JsonNode culture = feeds.get("culture");

		Logger.info
				(
				hot.toString() 
				+ "\n\n" + tech.toString()  
				+ "\n\n" + sport.toString()  
				+ "\n\n" + culture.toString()
				);
//		ArrayList<String> feedsTitles = new ArrayList<String>();
//		
//		ArrayList<String> categories = new ArrayList<String>();
//		
//		Iterator<JsonNode> it = feeds.getElements();
//		
//		while(it.hasNext()){
//			JsonNode jsonFeed = xmlToJSON(it.next().asText()).get("responseData").get("feed");
//			Logger.info("PROCESSING: " + jsonFeed.get("title"));
//			Iterator<JsonNode> entries = jsonFeed.get("entries").getElements();
//			while(entries.hasNext()){
//				JsonNode currentEntry = entries.next();
//				feedsTitles.add(currentEntry.get("title").asText());
//			}
//		}
//		
//		JsonNode jsonFeedsTitles = Json.toJson(feedsTitles);
//		
//		// Build the JSON that is going to be sent back
//		// to the display.
		ObjectNode response = Json.newObject();
//		response.put("kind", "mobileAnswer");
//		response.put("feeds", jsonFeedsTitles);
		return response;
	}



}
