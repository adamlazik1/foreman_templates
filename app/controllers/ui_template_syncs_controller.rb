require 'ostruct'

class UITemplateSyncsController < ApplicationController
  include ::Foreman::Controller::Parameters::TemplateParams

  rescue_from ::ForemanTemplates::PathAccessException do |error|
    render_errors [error.message]
  end

  def sync_settings
    import_settings = setting_definitions(ForemanTemplates::IMPORT_SETTING_NAMES)
    export_settings = setting_definitions(ForemanTemplates::EXPORT_SETTING_NAMES)
    @results = OpenStruct.new(:import => import_settings, :export => export_settings, :proxy => http_proxy_settings)
  end

  def import
    @parse_result = OpenStruct.new ForemanTemplates::TemplateImporter.new(ui_template_import_params).import!
  end

  def export
    @result = OpenStruct.new ForemanTemplates::TemplateExporter.new(ui_template_export_params).export!

    if @result.error
      render_errors [@result.error]
    end

    if @result.warning
      render_errors [@result.warning], 'warning'
    end
  end

  def action_permission
    case params[:action]
    when 'sync_settings'
      :view_template_syncs
    else
      super
    end
  end

  def parameter_filter_context
    Foreman::ParameterFilter::Context.new(:api, controller_name, params[:action])
  end

  def render_errors(messages, severity = 'danger')
    render :json => { :error => { :errors => { :base => messages }, full_messages: messages, :severity => severity } }, :status => :unprocessable_entity
  end

  private

  def setting_definitions(short_names)
    short_names.map { |name| Foreman.settings.find("template_sync_#{name}") }
  end

  def http_proxy_settings
    settings = [ Foreman.settings.find('template_sync_http_proxy_policy') ]
    proxy_id = http_proxy_id_setting
    settings << proxy_id if proxy_id
    settings
  end

  def http_proxy_id_setting
    proxy_list = HttpProxy.authorized(:view_http_proxies).with_taxonomy_scope.each_with_object({}) { |proxy, hash| hash[proxy.id] = proxy.name }
    if proxy_list.empty?
      return nil
    end
    default_proxy_id = proxy_list.keys.first
    OpenStruct.new(id: 'template_sync_http_proxy_id',
      name: 'template_sync_http_proxy_id',
      description: N_('Select an HTTP proxy to use for template sync'),
      settings_type: :string,
      value: default_proxy_id,
      default: default_proxy_id,
      full_name: N_('HTTP proxy'),
      select_values: proxy_list)
  end
end
