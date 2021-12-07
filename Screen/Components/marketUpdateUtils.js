import {ACCESS_API} from '@env';
import AsyncStorage from '@react-native-community/async-storage';

const fetchMarketUpdates = async (tokenValue) => {
  const response = await fetch(`${ACCESS_API}/marketupdateslist`, {
    method: 'POST',
    body: `Token=${encodeURIComponent(tokenValue)}`,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
    },
  });
  if (response) {
    const json = await response.json();
    if (json && json.length > 0) {
      let marketUpdateIds = json.map((x) => {
        return x.MarketUpdateId;
      });
      await AsyncStorage.setItem(
        'synced_market_updates',
        JSON.stringify(marketUpdateIds),
      );
      return json;
    } else return [];
  } else return [];
};

const checkUnreadMarketUpdates = async () => {
  let syncedMarketUpdates = await AsyncStorage.getItem('synced_market_updates');
  let _readMarketUpdates = await AsyncStorage.getItem('read_market_updates');
  if (syncedMarketUpdates) {
    let syncedMarketUpdateIds = JSON.parse(syncedMarketUpdates);
    if (syncedMarketUpdateIds.length > 0) {
      if (_readMarketUpdates) {
        let readMarketUpdateIds = JSON.parse(_readMarketUpdates);
        if (readMarketUpdateIds.length > 0) {
          var filteredReadMarketUpdateIds = readMarketUpdateIds.filter(
            function (n) {
              return syncedMarketUpdateIds.indexOf(n) !== -1;
            },
          );
          await AsyncStorage.setItem(
            'read_market_updates',
            JSON.stringify(filteredReadMarketUpdateIds),
          );
          let unreadUpdates = syncedMarketUpdateIds.filter(function (n) {
            return readMarketUpdateIds.indexOf(n) === -1;
          });
          return unreadUpdates.length;
        }
      }
      return syncedMarketUpdateIds.length;
    }
  }
  return 0;
};

const readMarketUpdates = async (ids) => {
  let readMarketUpdateIds = [];
  let _readMarketUpdates = await AsyncStorage.getItem('read_market_updates');
  if (_readMarketUpdates) {
    readMarketUpdateIds = JSON.parse(_readMarketUpdates);
    if (readMarketUpdateIds && readMarketUpdateIds.length > 0) {
      ids.map(async (id) => {
        if (readMarketUpdateIds.indexOf(id) === -1) {
          readMarketUpdateIds.push(id);
        }
      });
    } else {
      readMarketUpdateIds = ids;
    }
  } else {
    readMarketUpdateIds = ids;
  }
  await AsyncStorage.setItem(
    'read_market_updates',
    JSON.stringify(readMarketUpdateIds),
  );
};

const readTempMarketUpdates = async (id) => {
  let readMarketUpdateIds = [];
  let _readMarketUpdates = await AsyncStorage.getItem(
    'read_temp_market_updates',
  );
  if (_readMarketUpdates) {
    readMarketUpdateIds = JSON.parse(_readMarketUpdates);
    if (readMarketUpdateIds && readMarketUpdateIds.length > 0) {
      if (readMarketUpdateIds.indexOf(id) === -1) {
        readMarketUpdateIds.push(id);
      }
    } else {
      readMarketUpdateIds.push(id);
    }
  } else {
    readMarketUpdateIds.push(id);
  }
  await AsyncStorage.setItem(
    'read_temp_market_updates',
    JSON.stringify(readMarketUpdateIds),
  );
};

const markReadMarketUpdates = async () => {
  let readMarketUpdateIds = [];
  let _readTempMarketUpdates = await AsyncStorage.getItem(
    'read_temp_market_updates',
  );
  if (_readTempMarketUpdates) {
    readMarketUpdateIds = JSON.parse(_readTempMarketUpdates);
    if (readMarketUpdateIds.length > 0) {
      await readMarketUpdates(readMarketUpdateIds);
      await AsyncStorage.setItem(
        'read_temp_market_updates',
        JSON.stringify([]),
      );
    }
  }
};

export {
  fetchMarketUpdates,
  checkUnreadMarketUpdates,
  readMarketUpdates,
  readTempMarketUpdates,
  markReadMarketUpdates,
};
