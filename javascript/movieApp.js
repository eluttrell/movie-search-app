var app = angular.module('movies', ['ui.router']);

app.factory('$movieSearch', function($http) {
    var service = {};
    var API_KEY = 'd976895c9590a593173191e1acfe0eab';

    service.movieNameSearch = function(movieName, pageNum) {
        var url = 'http://api.themoviedb.org/3/search/movie';
        return $http({
            method: 'GET',
            url: url,
            params: {
                api_key: API_KEY,
                query: movieName,
                page: pageNum
            }
        });
    };

    service.nowPlaying = function() {
        var url = 'http://api.themoviedb.org/3/movie/now_playing';
        return $http({
            method: 'GET',
            url: url,
            params: {
                api_key: API_KEY
            }
        });
    };

    service.movieDetails = function(movieId) {
        var url = 'http://api.themoviedb.org/3/movie/' + movieId;
        return $http({
            method: 'GET',
            url: url,
            params: {
                api_key: API_KEY
            }
        });
    };

    service.movieCredits = function(movieId) {
        var url = 'https://api.themoviedb.org/3/movie/' + movieId + '/credits';
        return $http({
            method: 'GET',
            url: url,
            params: {
                api_key: API_KEY
            }
        })
    }

    return service;
});

app.controller('SearchController', function($scope, $stateParams, $state) {
    $scope.searchMovie = function() {
        $state.go('search', {
            query: $scope.query,
            page: 1
        });
    };
});

app.controller('SearchResultController', function($scope, $movieSearch, $stateParams, $state) {

    $scope.getResults = function() {
      $scope.whatPage = $stateParams.page;
      console.log($stateParams.query);
      console.log($scope.whatPage);
      $movieSearch.movieNameSearch($stateParams.query, $scope.whatPage).success(function(movieName) {

          $scope.currentPage = movieName;
          $scope.total_pages = movieName.total_pages;
          $scope.results = movieName.results;
          console.log(movieName);
          console.log($stateParams.query);
          console.log($scope.whatPage);
      });
    };

    $scope.getResults();

    console.log($scope.whatPage);

    $scope.firstPage = function() {
      $scope.whatPage = 1;
      $state.go('search', {
          query: $scope.lastSearch,
          page: $scope.whatPage
      })
    }

    $scope.lastPage = function() {
      if ($scope.currentPage.total_pages < 1000) {
        $scope.whatPage = $scope.currentPage.total_pages;
      } else {
        $scope.whatPage = 1000;
      }
      $state.go('search', {
          query: $scope.lastSearch,
          page: $scope.whatPage
      })
    }

    $scope.pageDown = function() {
      $scope.whatPage--;
      $state.go('search', {
          query: $scope.lastSearch,
          page: $scope.whatPage
      })
    }

    $scope.pageUp = function() {
      $scope.whatPage++;
      $state.go('search', {
          query: $scope.lastSearch,
          page: $scope.whatPage
      })
    }

    $scope.lastSearch = $stateParams.query;
    $scope.searchMovie = function() {
        $state.go('search', {
            query: $scope.query
        });
    };
});

app.controller('DetailsController', function($scope, $movieSearch, $stateParams, $state) {
    $movieSearch.movieDetails($stateParams.id).success(function(movieId) {
      $scope.details = movieId;
      console.log(movieId);
    });
    $movieSearch.movieCredits($stateParams.id).success(function(credits) {
      $scope.credits = credits;
      console.log(credits);
    })
    $scope.searchMovie = function() {
        $state.go('search', {
            query: $scope.query
        });
    };
    $scope.backButton = $stateParams.query;
    console.log($scope.backButton);
    $scope.bigPosterBool = false;
    $scope.bigPoster = function() {
        $scope.bigPosterBool = !$scope.bigPosterBool;
    }
});

app.controller('NowPlayingController', function($scope, $movieSearch, $stateParams) {
    $movieSearch.nowPlaying().success(function(results) {
      $scope.nowPlaying = results.results;
      console.log(results);
    })
})

app.config(function($stateProvider, $urlRouterProvider) {
    $stateProvider
        .state({
            name: 'home',
            url: '/',
            templateUrl: 'home.html',
            controller: 'SearchController'
        })
        .state({
            name: 'search',
            url: '/search/{query}/{page}',
            templateUrl: 'search.html',
            controller: 'SearchResultController'
        })
        .state({
            name: 'movie',
            url: '/movie/{query}/{id}',
            templateUrl: 'movie.html',
            controller: 'DetailsController'
        })
        .state({
          name: 'playing',
          url: '/playing',
          templateUrl: 'now_playing.html',
          controller: 'NowPlayingController'
        });
    $urlRouterProvider.otherwise('/');
})
