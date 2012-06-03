package models;

import java.util.Iterator;
import java.util.List;

import javax.persistence.Entity;
import javax.persistence.Id;

import play.data.validation.Constraints;
import play.db.ebean.Model;


@Entity
public class Tile extends Model{

	private static final long serialVersionUID = 1L;

	@Id
	public Long id;
	
	@Constraints.Required
	public String appName;
	
	@Constraints.Required
	public String startX;
	
	@Constraints.Required
	public String startY;
	
	@Constraints.Required
	public String width;
	
	@Constraints.Required
	public String height;
	
	@Constraints.Required
	public Long layoutID;
	
	@Constraints.Required	
	public String htmlSource;
	

	
	public static Finder<Long,Tile> find = new Finder<Long, Tile>(
			Long.class, 
			Tile.class
			);

	
	// Returns a list of all the layouts available
	public static List<Tile> all() {
		return find.all();
	}
	
	public static List<Tile> layoutTiles(Long layoutID){
		List<Tile> layoutTiles = find.where().eq("layoutID", layoutID).findList();
		return layoutTiles;
	}

	public static void deleteLayoutTiles(Long layoutID){
		List<Tile> layoutTiles = find.where().eq("layoutID", layoutID).findList();
		Iterator<Tile> it = layoutTiles.iterator();
		while(it.hasNext()){
			Tile currentTile = it.next();
			Long tileID = currentTile.id;
			delete(tileID);
		}
	}
	
	// Insert a new layout inside the database
	public static void addNew(Tile tile) {
		tile.save();
	}

	//	Deletes a layout with a given id
	public static void delete(Long id) {
		find.ref(id).delete();
	}

	@Override
	public String toString() {
		return "Tile [id=" + id + ", appName=" + appName + ", startX=" + startX
				+ ", startY=" + startY + ", width=" + width + ", height="
				+ height + ", layoutID=" + layoutID + ", htmlSource="
				+ htmlSource + "]";
	}

	
	
	
	
}
