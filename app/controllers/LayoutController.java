package controllers;

import java.io.File;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;
import javax.xml.transform.OutputKeys;
import javax.xml.transform.Source;
import javax.xml.transform.Transformer;
import javax.xml.transform.TransformerFactory;
import javax.xml.transform.dom.DOMSource;
import javax.xml.transform.stream.StreamResult;

import models.Display;
import models.DisplayLayout;
import models.Tile;

import org.codehaus.jackson.JsonNode;
import org.codehaus.jackson.node.ObjectNode;
import org.w3c.dom.Document;
import org.w3c.dom.Element;
import org.w3c.dom.Text;

import play.Logger;
import play.data.Form;
import play.mvc.BodyParser;
import play.mvc.BodyParser.Json;
import play.mvc.Controller;
import play.mvc.Result;
import views.html.*;
/**
 * @author romanelm
 *
 */
public class LayoutController extends Controller {
	
	
	
	/**
	 * View where the user can modify an 
	 * existing layout
	 * @param id ID of the layout
	 * @return an ok Result
	 */
	public static Result layout(Long id)  {
		List<Tile> tilesForLayoutId = Tile.layoutTiles(id);
		String displayLayout = DisplayLayout.get(id).name;
		return ok(layoutCreator.render(tilesForLayoutId,displayLayout,id));
	}

	
	/**
	 * Process an incoming json in order to create a new
	 * layout. The json that is received must contain
	 * an attribute 'name' where the name of the layout
	 * you want to create is specified.
	 * @return an ok Result
	 */
	@BodyParser.Of(Json.class)
	public static Result newLayout(){
		JsonNode json = request().body().asJson();
		ObjectNode result = play.libs.Json.newObject();
		if(json == null) {
			return badRequest("Expecting Json data");
		} else {
			String name = json.findPath("name").getTextValue();
			Logger.info("New layout created: " + name);
			if(name == null) {
				return badRequest("Missing parameter [name]");
			} else {
				Form<DisplayLayout> filledForm = form(DisplayLayout.class);
				Map<String,String> anyData = new HashMap<String, String>();
				anyData.put("name", name);
				DisplayLayout displayLayout = filledForm.bind(anyData).get();
				DisplayLayout layout = DisplayLayout.addNew(displayLayout);
				result.put("status", "OK");
			    result.put("name", layout.name);
			    result.put("id", layout.id);
				return ok(result);
			}
		}
	}

	/**
	 * Process an incoming ajax request containing a 
	 * json in order to save the current layout. 
	 * The json that is received must contain
	 * the followings attributes:
	 * 	'startX': initial X position of the tile
	 *  'startY': initial Y position of the tile
	 *  'width' : total width of the tile (in unit)
	 *  'height': total height of the tile (in unit)
	 *  'appName': the name of the app
	 * @param layoutID The ID of the layout for which
	 * you need to save the tiles.
	 * @return an ok Result
	 */
	@BodyParser.Of(Json.class)
	public static Result saveLayout(Long layoutID){		 
		JsonNode json = request().body().asJson();
		if(json.isArray()){
			
			ArrayList<JsonNode> allTilesSettings = new ArrayList<JsonNode>();
 			// erase all the tiles associated
			// with the layoutID specified
			Tile.deleteLayoutTiles(layoutID);
			
			Logger.info(Integer.toString(json.size()));
			Iterator<JsonNode> it = json.iterator();
			// Iterate over all the elements contained
			// in the json -> tiles
			while(it.hasNext()){
				JsonNode current = it.next();
				
				Form<Tile> filledForm = form(Tile.class);
				Map<String,String> anyData = new HashMap<String, String>();
				anyData.put("startX", current.get("startX").asText());
				anyData.put("startY", current.get("startY").asText());
				anyData.put("width", current.get("width").asText());
				anyData.put("height", current.get("height").asText());
				anyData.put("appName", current.get("appName").asText());
				anyData.put("htmlSource", current.get("htmlSource").asText());
				anyData.put("layoutID", layoutID.toString());
				allTilesSettings.add(current.get("settings"));
				Tile tile = filledForm.bind(anyData).get();
				Tile.addNew(tile);
				Logger.info("Tiles inserted correctly");
			}
			saveLayoutasXML(layoutID,allTilesSettings);
		}
		return ok("OK");
	}


	
	@BodyParser.Of(Json.class)
	public static Result deleteLayout(){
		JsonNode json = request().body().asJson();
		if(json == null) {
			return badRequest("Expecting Json data");
		} 
		Long id = json.get("layoutidselected").asLong();
		DisplayLayout.delete(id);
		Tile.deleteLayoutTiles(id);
		return redirect(routes.Application.manager());
	}
	
	public static Result updateLayoutInformations(){
		JsonNode json = request().body().asJson();
		if(json == null) {
			return badRequest("Expecting Json data");
		} 
		Long id = json.get("layoutidselected").asLong();
		String name = json.get("name").asText();
		
		DisplayLayout clone = (DisplayLayout) DisplayLayout.find.byId(id)._ebean_createCopy();
		clone.name = name;
		DisplayLayout.delete(id);
		DisplayLayout.addNew(clone);
		
		return redirect(routes.Application.manager());
	}
	
	public static void saveLayoutasXML(Long layoutID, ArrayList<JsonNode> allTilesSettings){
		
		Logger.info("DISPLAY: generating XML files for layoutID: " + layoutID);
		try {
			DocumentBuilderFactory docFactory = DocumentBuilderFactory.newInstance();
			DocumentBuilder docBuilder = docFactory.newDocumentBuilder();
			Document doc = docBuilder.newDocument();
			//create the root element and add it to the document
			Element root = doc.createElement("root");
			doc.appendChild(root);

			List<Tile> tiles = Tile.layoutTiles(layoutID);
			Iterator<Tile> it = tiles.iterator();
			Integer count = 0;
			while(it.hasNext()){
				Tile currentTile = it.next();
				//create child element display and add it to the root
				Element tileElement = doc.createElement("tile");
				root.appendChild(tileElement);
				
				createNodeInTile(doc, tileElement, "id", Long.toString(currentTile.id));
				createNodeInTile(doc, tileElement, "appname", currentTile.appName);
				createNodeInTile(doc, tileElement, "width", currentTile.width);
				createNodeInTile(doc, tileElement, "height",currentTile.height);
				createNodeInTile(doc, tileElement, "startX", currentTile.startX);
				createNodeInTile(doc, tileElement, "startY",currentTile.startY);
				createNodeInTile(doc, tileElement, "htmlSource",currentTile.htmlSource);
				
				Element settingsElement = doc.createElement("settings");
				tileElement.appendChild(settingsElement);
				
				
				JsonNode tilesettings = allTilesSettings.get(count);
				Iterator<String> settingFieldNames = tilesettings.getFieldNames();
				while(settingFieldNames.hasNext()){
					String currentFieldName = settingFieldNames.next();
					Element displayName = doc.createElement("parameter");
					displayName.setAttribute("value", tilesettings.get(currentFieldName).asText());
					Text nameText = doc.createTextNode(currentFieldName);
					displayName.appendChild(nameText);
					settingsElement.appendChild(displayName);
				}
				count++;
			}

			TransformerFactory transfac = TransformerFactory.newInstance();
			Transformer trans = transfac.newTransformer();
			trans.setOutputProperty(OutputKeys.OMIT_XML_DECLARATION, "yes");
			trans.setOutputProperty(OutputKeys.INDENT, "yes");
			trans.setOutputProperty("{http://xml.apache.org/xslt}indent-amount", "2");


			Display.printXML(doc, trans);
			
	        Source source = new DOMSource(doc);
	        File file = new File("public/displays/layouts/" + Long.toString(layoutID) + ".xml");
	        javax.xml.transform.Result result = new StreamResult(file);
	        trans.transform(source, result);
			
		} catch (Exception e) {
			e.printStackTrace();
		}
	}
	
	private static void createNodeInTile(Document doc, Element tileElement, String elementName, String elementValue) {
		Element displayName = doc.createElement(elementName);
		Text nameText = doc.createTextNode(elementValue);
		displayName.appendChild(nameText);
		tileElement.appendChild(displayName);
	}

}
