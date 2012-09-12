package models;

import java.util.List;

import javax.persistence.Entity;
import javax.persistence.Id;

import play.db.ebean.Model;

@Entity
public class DisplayLogger extends Model{

	private static final long serialVersionUID = 1L;
	
	@Id
	public Long id;
	
	public String appName;
	public String event;
	public String timestamp;
	public String who;
	public String content;
	
	public static Finder<Long,DisplayLogger> find = new Finder<Long, DisplayLogger>(Long.class, DisplayLogger.class);

	
	public static List<DisplayLogger> all() {
		return find.all();
	}
	
	public static DisplayLogger addNew(DisplayLogger dl) {
		dl.save();
		return dl;
	}
	
	public static DisplayLogger get(Long id){
		return find.ref(id);
	}
	
	public DisplayLogger(String appName, String event,String timestamp, String who, String content) {
		this.appName = appName;
		this.event = event;
		this.timestamp = timestamp;
		this.who = who;
		this.content = content;
	}
	
	
}
