package models;

import java.util.List;

import javax.persistence.Entity;
import javax.persistence.Id;

import play.data.validation.Constraints.Required;
import play.db.ebean.Model;

@Entity
public class DisplayLayout extends Model{

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	@Id
	public Long id;
	
	@Required
	public String name;
	
	public static Finder<Long,DisplayLayout> find = new Finder<Long, DisplayLayout>(
			Long.class, 
			DisplayLayout.class
			);

	
	// Returns a list of all the layouts available
	public static List<DisplayLayout> all() {
		return find.all();
	}

	// Insert a new layout inside the database
	public static DisplayLayout addNew(DisplayLayout layout) {
		layout.save();
		return layout;
	}

	//	Deletes a layout with a given id
	public static void delete(Long id) {
		find.ref(id).delete();
	}
	
	public static DisplayLayout get(Long id){
		return find.ref(id);
	}

	@Override
	public String toString() {
		return "DisplayLayout [id=" + id + ", name=" + name + "]";
	}
	

}
