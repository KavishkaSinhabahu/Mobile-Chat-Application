package controller;

import com.google.gson.Gson;
import com.google.gson.JsonObject;
import entity.User;
import entity.User_Status;
import java.io.IOException;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import model.HibernateUtil;
import org.hibernate.Criteria;
import org.hibernate.Session;
import org.hibernate.criterion.Restrictions;

@WebServlet(name = "UpdateProfile", urlPatterns = {"/UpdateProfile"})
public class UpdateProfile extends HttpServlet {

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

            User_Status user_Status = (User_Status) session.get(User_Status.class, 2);

            user.setUser_status(user_Status);
            session.update(user);
            session.beginTransaction().commit();

            responseJson.addProperty("success", true);
            responseJson.addProperty("message", "Success");

        } catch (Exception e) {
        }

        response.setContentType("application/json");
        response.getWriter().write(gson.toJson(responseJson));

    }

}
