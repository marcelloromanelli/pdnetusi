

import controllers.AppTwitterController;
import play.*;

public class Global extends GlobalSettings {

  @Override
  public void onStart(Application app) {
    Logger.info("Glogal: OnStart: Application has started...");
    AppTwitterController.initTweeterSearch();
    AppTwitterController.startTwitterStream();
    AppTwitterController.startTwitterScheduler();
  }  
  
  @Override
  public void onStop(Application app) {
    Logger.info("Global: OnStop: Application shutdown...");
    AppTwitterController.stopTwitterStream();
    AppTwitterController.stopTwitterScheduler();
  }  
    
}