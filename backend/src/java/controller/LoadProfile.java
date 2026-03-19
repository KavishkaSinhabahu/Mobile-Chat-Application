package controller;

import com.google.gson.Gson;
import com.google.gson.JsonObject;
import entity.User;
import entity.User_Status;
import java.io.File;
import java.io.IOException;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import model.HibernateUtil;
import org.hibernate.Session;

@WebServlet(name = "LoadProfile", urlPatterns = {"/LoadProfile"})
public class LoadProfile extends HttpServlet {

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {

        Gson gson = new Gson();

        JsonObject responseJson = new JsonObject();
        responseJson.addProperty("success", false);
        responseJson.addProperty("message", "Unable to process user request");

        try {

            Session session = HibernateUtil.getSessionFactory().openSession();

            String id = request.getParameter("id");

            User user = (User) session.get(User.class, Integer.parseInt(id));

            String serverPath = request.getServletContext().getRealPath("");
            String otherUserImagePath = serverPath + File.separator + "AvatarImages" + File.separator + user.getMobile() + ".png";
            File otherUserImage = new File(otherUserImagePath);
            
            JsonObject profile = new JsonObject();

            if (otherUserImage.exists()) {

                profile.addProperty("user_image", true);
            } else {

                profile.addProperty("user_image", false);
                profile.addProperty("user_image_letters", user.getFirst_name().charAt(0) + "" + user.getLast_name().charAt(0));
            }

            responseJson.addProperty("success", true);
            responseJson.addProperty("message", "Success");
            responseJson.addProperty("profile", gson.toJson(profile));

        } catch (Exception e) {
        }

        response.setContentType("application/json");
        response.getWriter().write(gson.toJson(responseJson));

    }

}
