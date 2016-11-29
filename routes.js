module.exports = (app, passport) => {
  app.get('/auth/steam', passport.authenticate('steam'),
          (req, res) => {
            // The request will be redirected to Steam for authentication, so
            // this function will not be called.
          });

  app.get('/auth/steam/return',
          passport.authenticate('steam', { failureRedirect: '/login' }),
          (req, res) => {
            // Successful authentication, redirect home.
            res.redirect('/');
          })

  // Define routes.
  app.get('/',
          (req, res) => {
            console.log(req.user)
            res.render('home', { user: req.user });
          });

  app.get('/logout',
          (req, res) => {
            req.logout();
            res.redirect('/');
          });

  app.get('/profile',
          require('connect-ensure-login').ensureLoggedIn(),
          function(req, res){
            res.render('profile', { user: req.user.profile });
          });

}
