const jwt = require("jsonwebtoken");
const Router = require("express").Router;
const router = new Router();

const User = require("../models/user");
const { SECRET_KEY } = require("../config");
const ExpressError = require("../expressError");


/** POST /login - login: {username, password} => {token}
 *
 * Make sure to update their last-login!
 *
 **/
router.post('/login', async (req,res, next) => {
    try{
        const{username, password} = req.body;
        const isAuthenticated = await User.authenticate(username, password);
        if (!isAuthenticated) {
          throw new ExpressError("Invalid credentials", 400);
        }
        await User.updateLoginTimestamp(username);
        const token = jwt.sign({username}, SECRET_KEY);
        res.json({token});
    } catch(e){
        return next(e)
    }
    
})


/** POST /register - register user: registers, logs in, and returns token.
 *
 * {username, password, first_name, last_name, phone} => {token}.
 *
 *  Make sure to update their last-login!
 */

router.post('/register', async (req, res, next) => {
    try{
        const{username, password, first_name, last_name, phone} = req.body;
        const newUser = await User.register({
            username,
            password,
            first_name,
            last_name,
            phone,
        });
         User.updateLoginTimestamp(username);
        const token = jwt.sign({username}, SECRET_KEY);
        res.json({token});
    } catch (e){
        return next(e)
    }

})

module.exports = Router;

