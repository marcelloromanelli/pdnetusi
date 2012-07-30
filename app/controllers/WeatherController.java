/**
 * 
 */
package controllers;

import java.io.InputStream;
import java.net.URL;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.Map;

import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;

import org.codehaus.jackson.JsonNode;
import org.codehaus.jackson.node.ObjectNode;
import org.w3c.dom.Attr;
import org.w3c.dom.Document;
import org.w3c.dom.NamedNodeMap;
import org.w3c.dom.Node;
import org.w3c.dom.NodeList;

import play.Logger;
import play.libs.F.Callback;
import play.libs.F.Callback0;
import play.libs.Json;
import play.mvc.Controller;
import play.mvc.WebSocket;
/**
 * @author romanelm
 */
public class WeatherController extends Controller {


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
