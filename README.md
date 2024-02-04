# members-only

- Premise: Create a simple blog posting app with user authentication. Members can
  write anonymous posts. People who aren't members can only see the content
  of the post, but can't see who authored the post.

# Requirements:

1. User: Keep track of user's full names, email (needs to be unique), password, and
   membership status. Let it be a boolean is_member or something similar. In a real app, they'd probably use a string or something to indicate membership_type or tier, so I think keeping it as a boolean is a good choice. An optional field 'admin' is a boolean that indicates whether
   a user is an admins or not. Admins can see everything, the author and timestamp of a post. They should be able to delete posts as well, as a delete button pops up on their screen for every post.

2. Post: Users create posts, so track their title, timestamp of when
   they were posted, and the conten of the post. We want to track who created
   each post/message.

3. Registration Form: Sign up form that gets users in the database. We're
   going to do server-side validation/sanitization on the input fields.
   Add a confirmPassword field and use a custom validator to ensure passwords
   match and whatnot. Also, after signing up users shouldn't be automatically
   considered members. "A private club isn't fun if anyone can join", so
   add another form page, where members can join the club by entering secret
   passcode. For creating an admin, keep it simple and just add a 'check-box'
   on the 'registration' page. You're always welcome to do another secret form page though.

   - Link to custom validator docs: https://express-validator.github.io/docs/guides/customizing/

4. Login form: Create a login form and use passportjs. Here you'll create your custom
   verification function. Let the user be able to login using their 'username' for now since
   we're going to allow the possibility for multiple accounts per email. Maybe we'll be able
   to do something like account switching, but for now we should focus on the main functions of our app. And
   then the second field would be 'password'.

5. Create post form: All users can create new posts.

6. Home Page: Displays all user messages, but only members can see the
   author and dates of those messages.

7. Summary: Anyone who comes across the site should see a list of messages, with authors
   and timestamps hidden. Users can sign in and create messages, but only usres that are
   'members' should be able to see the author and date of each message. Your admin user should
   see everything and be able to delete messages. Obviously it's just a silly app so don't
   take things too seriously and try to mimic a real site, but of course practice databases
   and authentication. When finished, deploy it with your PaaS service of choice. In our
   case we're deployign on 'Render'

# Project setup:

1. npm i -D dotenv nodemon mocha
2. npm i connect-mongo express express-session mongoose passport passport-local compression cookie-parser debug express-async-handler express-rate-limit express-validator helmet http-errors luxon morgan ejs

# Important Packages Explained:

1. dotenv: For helping work with .env files
2. nodemon: Hot reloading during development
3. express: For handling server-side routing.
4. connect-mongo: Connects us to a mongodb database so we can store session data there, rather than just on mnthe server.
5. mongoose: Odm
6. passport passport-local express-session: Needed for authentication.
7. express-validator: Sanitizing and cleaning up data
8. express-async-handler: Wraps async functions in try-catch.
9. luxon: For date manipulation.
10. express-session: For session handling in express.
11. bcrypt: For hashing passwords

- npm i connect-mongo express express-session mongoose passport passport-local bcrypt luxon
- npm i -D dotenv nodemon

# Credits:

1.  inspiration: https://members-only-top.netlify.app/;

- NOTE: Just need this for the front end. This uses mern and uses the ideas from the next lesson/project, so just use this as a css inspiration.

# Test user:

- Test user email is 'knguyen44@ivytech.edu' while password is 'Password_123';
- Member user "mymember@ivytech.edu' with password 'Password_123'
- Admin user "myadmin@ivytech.edu' with password 'Password_123'
