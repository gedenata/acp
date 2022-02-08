import AsyncStorage from '@react-native-community/async-storage';
import {ACCESS_API} from '@env';

const fetchMarketUpdates = async (token) => {
  const url = `${ACCESS_API}/marketupdateslist`;
  const params = {
    method: 'POST',
    body: `Token=${encodeURIComponent(token)}`,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
    },
  };
  const response = await fetch(url, params);
  if (response) {
    const json = await response.json();
    if (json && json.length > 0) {
      let marketUpdateIds = json.map((item) => {
        return item.MarketUpdateId;
      });
      await AsyncStorage.setItem(
        'synced_market_updates',
        JSON.stringify(marketUpdateIds),
      );
      return json;
    } else {
      return [];
    }
  } else {
    return [];
  }
};

const checkUnreadMarketUpdates = async () => {
  const syncedItem = await AsyncStorage.getItem('synced_market_updates');
  const readItem = await AsyncStorage.getItem('read_market_updates');
  if (syncedItem) {
    const syncedItemId = JSON.parse(syncedItem);
    if (syncedItemId.length > 0) {
      if (readItem) {
        const readItemId = JSON.parse(readItem);
        if (readItemId.length > 0) {
          const filteredItemId = readItemId.filter(function (n) {
            return syncedItemId.indexOf(n) !== -1;
          });
          await AsyncStorage.setItem(
            'read_market_updates',
            JSON.stringify(filteredItemId),
          );
          const unreadUpdates = syncedItemId.filter(function (n) {
            return readItemId.indexOf(n) === -1;
          });
          return unreadUpdates.length;
        }
      }
      return syncedItemId.length;
    }
  }
  return 0;
};

const readMarketUpdates = async (ids) => {
  let readItemId = [];
  const readItem = await AsyncStorage.getItem('read_market_updates');
  if (readItem) {
    readItemId = JSON.parse(readItem);
    if (readItemId && readItemId.length > 0) {
      ids.map(async (id) => {
        if (readItemId.indexOf(id) === -1) {
          readItemId.push(id);
        }
      });
    } else {
      readItemId = ids;
    }
  } else {
    readItemId = ids;
  }
  await AsyncStorage.setItem('read_market_updates', JSON.stringify(readItemId));
};

const readTempMarketUpdates = async (id) => {
  let readItemId = [];
  const readItem = await AsyncStorage.getItem('read_temp_market_updates');
  if (readItem) {
    readItemId = JSON.parse(readItem);
    if (readItemId && readItemId.length > 0) {
      if (readItemId.indexOf(id) === -1) {
        readItemId.push(id);
      }
    } else {
      readItemId.push(id);
    }
  } else {
    readItemId.push(id);
  }
  await AsyncStorage.setItem(
    'read_temp_market_updates',
    JSON.stringify(readItemId),
  );
};

const markReadMarketUpdates = async () => {
  let readItemId = [];
  const readTemplateItem = await AsyncStorage.getItem(
    'read_temp_market_updates',
  );
  if (readTemplateItem) {
    readItemId = JSON.parse(readTemplateItem);
    if (readItemId.length > 0) {
      await readMarketUpdates(readItemId);
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
