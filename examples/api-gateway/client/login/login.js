angular.module( 'sample.login', [
  'auth0'
])
.controller( 'LoginCtrl', function HomeController( $scope, auth, $location, store ) {

  function getOptionsForRole(isAdmin, token) {
    if(isAdmin) {
      // TODO: update roles and principals based upon your account settings.
      return {
          "id_token": token, 
          "role":"arn:aws:iam::012345678901:role/auth0-api-role",
          "principal": "arn:aws:iam::012345678901:saml-provider/auth0-api"

        };
      }
    else {
      return {
          "id_token": token, 
          "role":"arn:aws:iam::012345678901:role/auth0-api-social-role",
          "principal": "arn:aws:iam::012345678901:saml-provider/auth0-api"
        };
    }
  }

  $scope.login = function() {
     var params = {
        authParams: {
          scope: 'openid email' 
        }
      };

    auth.signin(params, function(profile, token) {
      // set isAdmin based upon whether or not a social login. Often you'll do
      // something more sophisticated than this.
      store.set('profile', profile);
      store.set('token', token);

      // get delegation token from identity token.
      profile.isAdmin = !profile.identities[0].isSocial;
      var options = getOptionsForRole(profile.isAdmin, token);

      // TODO: Step 1: Enable this section once you setup AWS delegation.
      /*
      auth.getToken(options)
        .then(
          function(delegation)  {
            store.set('awstoken', delegation.Credentials);  //add to local storage
            $location.path("/");
          }, 
        function(err) {
           console.log('failed to acquire delegation token', err);
      });
      */
      // TODO: Step 1: Remove this redirect after you add the get token API.
      $location.path("/");

    }, function(error) {
      console.log("There was an error logging in", error);
    });
  }
});
