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
  let readMarketUpdates = await AsyncStorage.getItem('read_market_updates');
  if (syncedMarketUpdates) {
    let syncedMarketUpdateIds = JSON.parse(syncedMarketUpdates);
    if (syncedMarketUpdateIds.length > 0) {
      if (readMarketUpdates) {
        let readMarketUpdateIds = JSON.parse(readMarketUpdates);
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

const readMarketUpdates = async (id) => {
  let readMarketUpdateIds = [];
  let readMarketUpdates = await AsyncStorage.getItem('read_market_updates');
  if (readMarketUpdates) {
    readMarketUpdateIds = JSON.parse(readMarketUpdates);
    if (readMarketUpdateIds && readMarketUpdateIds.length > 0) {
      if (readMarketUpdateIds.indexOf(id) === -1) {
        readMarketUpdateIds.push(id);
      }
    } else {
      readMarketUpdateIds = [id];
    }
  } else {
    readMarketUpdateIds = [id];
  }
  await AsyncStorage.setItem(
    'read_market_updates',
    JSON.stringify(readMarketUpdateIds),
  );
};

const readTempMarketUpdates = async (id) => {
  let readMarketUpdateIds = [];
  let readMarketUpdates = await AsyncStorage.getItem(
    'read_temp_market_updates',
  );
  if (readMarketUpdates) {
    readMarketUpdateIds = JSON.parse(readMarketUpdates);
    if (readMarketUpdateIds && readMarketUpdateIds.length > 0) {
      if (readMarketUpdateIds.indexOf(id) === -1) {
        readMarketUpdateIds.push(id);
      }
    } else {
      readMarketUpdateIds = [id];
    }
  } else {
    readMarketUpdateIds = [id];
  }
  await AsyncStorage.setItem(
    'read_temp_market_updates',
    JSON.stringify(readMarketUpdateIds),
  );
};

const markReadMarketUpdates = async () => {
  let readMarketUpdateIds = [];
  let readTempMarketUpdates = await AsyncStorage.getItem(
    'read_temp_market_updates',
  );
  if (readTempMarketUpdates) {
    readMarketUpdateIds = JSON.parse(readTempMarketUpdates);
    readMarketUpdateIds.map(async (val) => {
      await readMarketUpdates(val);
    });
    await AsyncStorage.setItem(
      'read_temp_market_updates',
      JSON.stringify([]),
    );
  }
};

export {
  fetchMarketUpdates,
  checkUnreadMarketUpdates,
  readMarketUpdates,
  readTempMarketUpdates,
  markReadMarketUpdates,
};
