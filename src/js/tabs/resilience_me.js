var util      = require('util');
var webutil   = require('../util/web');
var Tab       = require('../client/tab').Tab;

var resilience_meTab = function ()
{
  Tab.call(this);
};

util.inherits(resilience_meTab, Tab);

resilience_meTab.prototype.tabName = 'resilience_me';
resilience_meTab.prototype.mainMenu = 'resilience_me';

// /contact is the way it appears in Ripple URIs
resilience_meTab.prototype.aliases = ['resilience_me'];

resilience_meTab.prototype.generateHtml = function ()
{
  return require('../../jade/tabs/resilience_me.jade')();
};

resilience_meTab.prototype.angular = function (module) {
  module.controller('resilience_meCtrl', ['$scope', 'rpId', 'rpTracker',
    function ($scope, $id, $rpTracker)
  {
    if (!$id.loginStatus) return $id.goId();

    $scope.reset_form = function ()
    {
      $scope.resilience_me = {
        currency: '',
        taxRate: ''
      };
      if ($scope.addForm) $scope.addForm.$setPristine();
    };

    $scope.reset_form();

    /**
     * Toggle "add contact" form
     */
    $scope.toggle_form = function ()
    {
      $scope.addform_visible = !$scope.addform_visible;
      $scope.reset_form();
    };
    


    /**
     * Add a currency
     */
    $scope.create = function ()
    {
      var resilience_me = {
        currency: $scope.resilience_me.currency.toUpperCase(),
        taxRate: $scope.resilience_me.taxRate / 100
      };
      
      

      // Enable the animation
      $scope.enable_highlight = true;

      // Add an element
      $scope.userBlob.unshift("/resilience_me", resilience_me);

      // Hide the form
      $scope.toggle_form();

      // Clear form
      $scope.reset_form();
    };
  }]);

  module.controller('Resilience_meRowCtrl', ['$scope', '$location',
    function ($scope, $location) {
      $scope.editing = false;

      /**
       * Switch to edit mode
       *
       * @param index
       */
      $scope.edit = function (index)
      {
        $scope.editing = true;
        $scope.editcurrency = $scope.entry.currency;
        $scope.edittaxRate = $scope.entry.taxRate;
      };

      /**
       * Update contact
       *
       * @param index
       */
      $scope.update = function (index)
      {
        if (!$scope.inlineCurrency.editcurrency.$error.rpUnique) {



          var entry = {
            currency: $scope.editcurrency,
            taxRate: $scope.edittaxRate

          };
          


          // Update blob
          $scope.userBlob.filter('/resilience_me', 'currency', $scope.entry.currency,
                                 'extend', '', entry);

          $scope.editing = false;
        }
      };

      /**
       * Remove contact
       *
       * @param index
       */
      $scope.remove = function (currency) {
        // Update blob
        $scope.userBlob.filter('/resilience_me', 'currency', $scope.entry.currency,
                               'unset', '');
      };

      /**
       * Cancel contact edit
       *
       * @param index
       */
      $scope.cancel = function (index)
      {
        $scope.editing = false;
      };

     
    }]);
};

module.exports = resilience_meTab;
