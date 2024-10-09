import React from 'react';
import PropTypes from 'prop-types';
import { translate as __ } from 'foremanReact/common/I18n';

import { Field as FormikField } from 'formik';
import ProxySettingField from './ProxySettingField';

const ProxySettingsFields = ({
  proxySettings,
  syncType,
  resetField,
  formProps: { isSubmitting },
}) => {
  if (proxySettings.length === 0) {
    return <></>;
  }
  const proxyPolicySetting = proxySettings[0];
  const proxyIdSetting = proxySettings[1] ?? null;
  const proxyPolicyFieldName = `${syncType}.http_proxy_policy`;
  const proxyIdFieldName = `${syncType}.http_proxy_id`;

  return (
    <React.Fragment>
      <FormikField
        name={proxyPolicyFieldName}
        render={({ field, form }) => (
          <ProxySettingField
            setting={proxyPolicySetting}
            resetField={resetField}
            field={field}
            form={form}
            fieldName={proxyPolicyFieldName}
          />
        )}
      />
      <FormikField
        name={proxyIdFieldName}
        render={({ field, form }) => {
          // Changing name to camel case here would unnecessarily complicate the code
          // eslint-disable-next-line camelcase
          if (form.values[syncType]?.http_proxy_policy === 'selected') {
            // TODO: align this text properly
            if (proxyIdSetting === null) {
              return <>{__('No HTTP proxies available')}</>;
            }
            return (
              <ProxySettingField
                setting={proxyIdSetting}
                resetField={resetField}
                field={field}
                form={form}
                fieldName={proxyIdFieldName}
              />
            );
          }
          return <></>;
        }}
      />
    </React.Fragment>
  );
};

ProxySettingsFields.propTypes = {
  proxySettings: PropTypes.array,
  syncType: PropTypes.string.isRequired,
  resetField: PropTypes.func.isRequired,
  formProps: PropTypes.object,
};

ProxySettingsFields.defaultProps = {
  formProps: {},
  proxySettings: [],
};

export default ProxySettingsFields;
