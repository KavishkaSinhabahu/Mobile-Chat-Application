package controller;

import com.google.gson.Gson;
import com.google.gson.JsonObject;
import entity.User;
import entity.User_Status;
import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.StandardCopyOption;
import java.util.Date;
import javax.servlet.ServletException;
import javax.servlet.annotation.MultipartConfig;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.Part;
import model.HibernateUtil;
import model.Validations;
import org.hibernate.Criteria;
import org.hibernate.Session;
import org.hibernate.criterion.Restrictions;

@MultipartConfig
@WebServlet(name = "SignUp", urlPatterns = {"/SignUp"})
public class SignUp extends HttpServlet {

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {

        Gson gson = new Gson();
        JsonObject responseJson = new JsonObject();
        responseJson.addProperty("success", false);

        String mobile = request.getParameter("mobile");
        String firstName = request.getParameter("firstName");
        String lastName = request.getParameter("lastName");
        String password = request.getParameter("password");
        Part avatarImage = request.getPart("avatarImage");

        if (mobile.isEmpty()) {

            responseJson.addProperty("message", "Please fill Mobile Number");
        } else if (!Validations.isMobileNumberValid(mobile)) {

            responseJson.addProperty("message", "Invalid Mobile Number");
        } else if (firstName.isEmpty()) {

            responseJson.addProperty("message", "Please fill First Name");
        } else if (lastName.isEmpty()) {

            responseJson.addProperty("message", "Please fill Last Name");
        } else if (password.isEmpty()) {

            responseJson.addProperty("message", "Please fill Last Name");
        } else if (!Validations.isPasswordValid(password)) {

            responseJson.addProperty("message", "Password must include at least one uppercase letter, "
                    + "lowercase letter, "
                    + "number, "
                    + "special character, "
                    + "minimum 8 characters");

        } else {

            //data validated
            Session session = HibernateUtil.getSessionFactory().openSession();

            Criteria criteria1 = session.createCriteria(User.class);
            criteria1.add(Restrictions.eq("mobile", mobile));

            if (!criteria1.list().isEmpty()) {

                //mobile already used
                responseJson.addProperty("message", "User already Registered");
            } else {

                User user = new User();
                user.setFirst_name(firstName);
                user.setLast_name(lastName);
                user.setMobile(mobile);
                user.setPassword(password);
                user.setRegistered_date_time(new Date());

                //get user status 2 = offline
                User_Status user_status = (User_Status) session.get(User_Status.class, 2);
                user.setUser_status(user_status);

                session.save(user);
                session.beginTransaction().commit();

                //check upload image
                if (avatarImage != null) {

                    //image selected
                    String serverPath = request.getServletContext().getRealPath("");
                    String avatarImagePath = serverPath + File.separator + "AvatarImages" + File.separator + mobile + ".png";
                    File file = new File(avatarImagePath);
                    Files.copy(avatarImage.getInputStream(), file.toPath(), StandardCopyOption.REPLACE_EXISTING);

                }

                responseJson.addProperty("success", true);
                responseJson.addProperty("message", "Registerd Successfully.");
            }

            session.close();

        }

        response.setContentType("application/json");
        response.getWriter().write(gson.toJson(responseJson));

    }

}
