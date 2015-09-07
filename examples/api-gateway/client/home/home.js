angular.module( 'sample.home', ['auth0'])
.controller( 'HomeCtrl', function HomeController( $scope, auth, $http, $location, store ) {
  $scope.pets = [];
  $scope.isAdmin = store.get('profile').isAdmin;
  $scope.profile = store.get('profile');
  $scope.adding = false;

  function showError(response) {
    if (response instanceof Error) {
       console.log('Error', response.message);
    } else {
      console.log(response.data);
      console.log(response.status);
      console.log(response.headers);
      console.log(response.config);
    }
  }

  function getBearerToken() {
    var token = store.get('token');
    return "bearer " + token;
  }

  function getPets() {
    window.alert('getPets not implemented');
  }

  // --- Add for updating --- 
  function getSecureApiClient() {
    var awstoken = store.get('awstoken');

    return apigClientFactory.newClient({
        accessKey: awstoken.AccessKeyId,
        secretKey: awstoken.SecretAccessKey,
        sessionToken: awstoken.SessionToken,
        region: 'us-east-1' // Set to your region
    });
  }

  function putPets(updatedPets) {
      window.alert('putPets not implemented');
  }

  function buyPet(user, id) {
      window.alert('buyPet not implemented');
  }
  
  $scope.addPets = function() {
    $scope.adding = true;
  }

  $scope.cancelAddPet = function() {
    $scope.adding = false;
  }

  $scope.removePet = function(id) {
    var index = -1;

     angular.forEach($scope.pets, function(p, i) {
       if(p.id === id) index = i;
     });   
    
     if(index >= 0) {
        $scope.pets.splice(index, 1);
        putPets($scope.pets);
     }
  }

  $scope.buyPet = function(id) {
    var profile = store.get('profile');
    var user = profile.name || profile.email;
    buyPet(user, id);
  }

  $scope.savePet = function() {
    var maxid = 0;

    angular.forEach($scope.pets, function(p) {
      if(p.id > maxid) maxid = p.id;
    });
    
    var newPet = {};
    newPet.id = maxid + 1;
    newPet.type = $scope.newpet.type;
    newPet.price = $scope.newpet.price;
    $scope.newpet.type = "";
    $scope.newpet.price = "";
    $scope.pets.push(newPet);
    putPets($scope.pets);
    $scope.adding = false;
  }

  $scope.logout = function() {
    auth.signout();
    store.remove('profile');
    store.remove('token');
    $location.path('/login');
  }

  getPets();

});
