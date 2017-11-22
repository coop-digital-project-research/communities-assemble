activate :autoprefixer do |prefix|
  prefix.browsers = "last 2 versions"
end

page '/*.xml', layout: false
page '/*.json', layout: false
page '/*.txt', layout: false

activate :relative_assets
set :relative_links, true

activate :directory_indexes

activate :deploy do |deploy|
  deploy.deploy_method = :git
  deploy.branch   = 'build'
end

activate :livereload
activate :asset_hash
