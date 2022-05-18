import AsyncStorage from '@react-native-community/async-storage';
import {ACCESS_API} from '@env';

const fetchFinanceMatter = async (token) => {
  const url = `${ACCESS_API}/financematterinfo`;
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
    if (json.Data && json.Data.length > 0) {
      let financeMatterIds = json.Data.map((item) => {
        return item.FinanceMatterID;
      });
      await AsyncStorage.setItem(
        'synced_finance_matter',
        JSON.stringify(financeMatterIds),
      );
      return json;
    } else {
      return [];
    }
  } else {
    return [];
  }
};

const checkUnreadFinanceMatter = async () => {
  const syncedItems = await AsyncStorage.getItem('synced_finance_matter');
  const readItem = await AsyncStorage.getItem('read_finance_matter');
  if (syncedItems) {
    const syncedItemId = JSON.parse(syncedItems);
    if (syncedItemId.length > 0) {
      if (readItem) {
        const readItemId = JSON.parse(readItem);
        if (readItemId.length > 0) {
          const filteredItemId = readItemId.filter(function (n) {
            return syncedItemId.indexOf(n) !== -1;
          });
          await AsyncStorage.setItem(
            'read_finance_matter',
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

const readFinanceMatter = async (ids) => {
  let readItemId = [];
  const readItem = await AsyncStorage.getItem('read_finance_matter');
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
  await AsyncStorage.setItem('read_finance_matter', JSON.stringify(readItemId));
};

const readTempFinanceMatter = async (id) => {
  let readItemId = [];
  const readItem = await AsyncStorage.getItem('read_temp_finance_matter');
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
    'read_temp_finance_matter',
    JSON.stringify(readItemId),
  );
};

const markReadFinanceMatter = async () => {
  let readItemId = [];
  const readTemplateItem = await AsyncStorage.getItem(
    'read_temp_finance_matter',
  );
  if (readTemplateItem) {
    readItemId = JSON.parse(readTemplateItem);
    if (readItemId.length > 0) {
      await readFinanceMatter(readItemId);
      await AsyncStorage.setItem(
        'read_temp_finance_matter',
        JSON.stringify([]),
      );
    }
  }
};

const checkIfReadOrUnreadFinMtr = async (id) => {
  let result = false;
  let readItemId = [];
  const readItem = await AsyncStorage.getItem('read_finance_matter');
  if (readItem) {
    readItemId = JSON.parse(readItem);
    if (readItemId && readItemId.length > 0) {
      if (readItemId.indexOf(id) !== -1) {
        result = true;
      }
    }
  }
  return result;
};

export {
  fetchFinanceMatter,
  checkUnreadFinanceMatter,
  readFinanceMatter,
  readTempFinanceMatter,
  markReadFinanceMatter,
  checkIfReadOrUnreadFinMtr,
};
