// TODO
// this file is not yet included.
// the following code is copied from the old giant controller

/*
$scope.saveRouterInformation = function() {
  routerInformation.gatherRouterInformation()
    .then(function() {
      $scope.state.system = routerInformation.getSystemInformation();
      var wirelessInfo = routerInformation.getWirelessInformation();
      Object.keys(wirelessInfo).map(function(key, index) {
        $scope.state.wifi.devices[key] = {
          scanFilter: 'freifunk'
        };
        if (wirelessInfo[key].up && Object.keys(wirelessInfo[key].interfaces).length > 0) {
          routerInformation.scanForWifi(wirelessInfo[key].interfaces[0].ifname)
            .then(function(data) {
              $scope.state.wifi.devices[key].scan = data.results;
            });
        }
        if (wirelessInfo[key].config.hwmode.includes('11a')) {
          $scope.state.wifi.devices[key].mode = '11a';
          $scope.wizard.wifi[key] = {
            mode: 'adhoc',
            channel: 36,
            ssid: 'intern-ch36-bat1.freifunk.net',
            bssid: '02:ca:ff:ee:ba:36',
            batVlan: 1
          };
        } else {
          $scope.state.wifi.devices[key].mode = 'legacy';
          $scope.wizard.wifi[key] = {
            mode: 'adhoc',
            channel: 13,
            ssid: 'intern-ch13-berlin.freifunk.net',
            bssid: '02:ca:ff:ee:ba:be',
            batVlan: 1
          };
        }
      });
    });
};

$scope.applyDefaults = function(device, config) {
  var channel;
  if (device.mode === '11a') {
    channel = 36;
  } else if (device.mode === 'legacy') {
    channel = 13;
  }
  if (!channel) {
    console.error('device does not support 5 or 2.4 GHz');
    return;
  }
  angular.extend(config, {
    mode: 'adhoc',
    channel: channel,
    ssid: 'intern-ch' + channel + '.freifunk.net',
    meshId: 'freifunk',
    batVlan: 1,
    bssid: '02:ca:ff:ee:ba:be'
  });
};

$scope.applyScan = function(device, config, scan) {
  var batRegexp = /.*bat([0-9]*).*/g;
  var batMatch = batRegexp.exec(scan.ssid);
  var batVlan = batMatch ? parseInt(batMatch[1]) : 1;

  angular.extend(config, {
    mode: scan.mode === 'Master' ? 'sta' : scan.mode,
    channel: scan.channel,
    ssid: scan.ssid,
    meshId: scan.meshId,
    bssid: scan.bssid,
    batVlan: batVlan
  });
};
*/
