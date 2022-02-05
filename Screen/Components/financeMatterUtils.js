import AsyncStorage from '@react-native-community/async-storage';
import {ACCESS_API} from '@env';

const fetchFinanceMatter = async (token) => {
  const url = `${ACCESS_API}/financematterinfo`;
  const urlParams = {
    method: 'POST',
    body: `Token=${encodeURIComponent(token)}`,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
    },
  };
  const response = await fetch(url, urlParams);

  if (response) {
    const jsonResponse = await response.json();

    if (jsonResponse && jsonResponse.length > 0) {
      const financeMatterIds = jsonResponse.map((x) => {
        return x.FinanceMatterId;
      });
      await AsyncStorage.setItem(
        'synced_finance_matter',
        JSON.stringify(financeMatterIds),
      );
      return jsonResponse;
    } else {
      return [];
    }
  } else {
    return [];
  }
};

const checkUnreadFinanceMatter = async () => {
  const syncedFinanceMatter = await AsyncStorage.getItem(
    'synced_finance_matter',
  );
  const readFinanceMatter = await AsyncStorage.getItem('read_finance_matter');

  if (syncedFinanceMatter) {
    const syncedFinanceMatterIds = JSON.parse(syncedFinanceMatter);

    if (syncedFinanceMatterIds.length > 0) {
      if (readFinanceMatter) {
        const readFinanceMatterIds = JSON.parse(readFinanceMatter);
        if (readFinanceMatterIds.length > 0) {
          const filteredReadFinanceMatterIds = readFinanceMatterIds.filter(
            (n) => {
              return syncedFinanceMatterIds.indexOf(n) !== -1;
            },
          );
          await AsyncStorage.setItem(
            'read_finance_matter',
            JSON.stringify(filteredReadFinanceMatterIds),
          );
          const unreadFinanceMatterIds = syncedFinanceMatterIds.filter((n) => {
            return readFinanceMatterIds.indexOf(n) === -1;
          });
          return unreadFinanceMatterIds.length;
        }
      }
      return syncedFinanceMatterIds.length;
    }
  }
  return 0;
};

const readFinanceMatter = async (ids) => {
  var readFinanceMatterId = [];
  const syncFinanceMatters = await AsyncStorage.getItem('read_finance_matter');

  if (syncFinanceMatters) {
    readFinanceMatterId = JSON.parse(syncFinanceMatters);
    if (readFinanceMatterId && readFinanceMatterId.length > 0) {
      ids.map((id) => {
        if (readFinanceMatterId.indexOf(id) === -1) {
          readFinanceMatterId.push(id);
        }
      });
    } else {
      readFinanceMatterId = ids;
    }
  } else {
    readFinanceMatterId = ids;
  }

  await AsyncStorage.setItem(
    'read_finance_matter',
    JSON.stringify(readFinanceMatterId),
  );
};

const readTemplateFinanceMatter = async (id) => {
  var readFinanceMatterId = [];
  const syncFinanceMatters = await AsyncStorage.getItem(
    'read_template_finance_matter',
  );

  if (syncFinanceMatters) {
    readFinanceMatterId = JSON.parse(syncFinanceMatters);
    if (readFinanceMatterId && readFinanceMatterId.length > 0) {
      if (readFinanceMatterId.indexOf(id) === -1) {
        readFinanceMatterId.push(id);
      }
    } else {
      readFinanceMatterId.push(id);
    }
  } else {
    readFinanceMatterId.push(id);
  }

  await AsyncStorage.setItem(
    'read_template_finance_matter',
    JSON.stringify(readFinanceMatterId),
  );
};

const markReadFinanceMatter = async () => {
  var readFinanceMatterId = [];
  const syncFinanceMatters = await AsyncStorage.getItem(
    'read_template_finance_matter',
  );

  if (syncFinanceMatters) {
    readFinanceMatterId = JSON.parse(syncFinanceMatters);
    if (readFinanceMatterId.length > 0) {
      await readFinanceMatter(readFinanceMatterId);
      await AsyncStorage.removeItem(
        'read_template_finance_matter',
        JSON.stringify([]),
      );
    }
  }
};

export {
  fetchFinanceMatter,
  checkUnreadFinanceMatter,
  readFinanceMatter,
  readTemplateFinanceMatter,
  markReadFinanceMatter,
};
