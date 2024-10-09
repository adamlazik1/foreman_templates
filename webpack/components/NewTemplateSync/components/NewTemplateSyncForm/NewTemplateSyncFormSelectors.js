import { createSelector } from 'reselect';

import {
  selectImportSettings,
  selectExportSettings,
  selectProxySettings,
} from '../../NewTemplateSyncSelectors';

export const transformInitialValues = settings =>
  settings.reduce(
    (memo, item) => Object.assign(memo, { [item.name]: item.value }),
    {}
  );

export const selectInitialFormValues = createSelector(
  selectImportSettings,
  selectExportSettings,
  selectProxySettings,
  (importSettings, exportSettings, proxySettings) => {
    const transformedProxySettings = transformInitialValues(proxySettings);
    return {
      import: {
        ...transformInitialValues(importSettings),
        ...transformedProxySettings,
      },
      export: {
        ...transformInitialValues(exportSettings),
        ...transformedProxySettings,
      },
    };
  }
);
