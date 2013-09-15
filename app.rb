require 'rubygems'
require 'haml'
require 'sinatra'
require 'sass'
require 'compass'

get '/' do
  haml :index
end

get '/infographic' do
  haml :infographic, :layout => false
end

configure do
  Compass.configuration do |config|
    config.project_path = File.dirname(__FILE__)
    config.sass_dir = 'views/stylesheets'
  end

  set :scss, Compass.sass_engine_options
end

get '/stylesheets/*.css' do
  content_type 'text/css', :charset => 'utf-8'
  filename = params[:splat].first
  scss filename.to_sym, :views => "#{settings.root}/views/stylesheets"
end