# Project reference setup with Ansible & Vagrant

[![Build Status](https://travis-ci.org/wunderkraut/WunderMachina.svg)](https://travis-ci.org/wunderkraut/WunderMachina)
[![Build Status](https://travis-ci.org/wunderkraut/WunderTools.svg)](https://travis-ci.org/wunderkraut/WunderTools)


## Requirements
- Install [Vagrant](https://www.vagrantup.com/downloads.html) 1.9.2 or greater
- Install [vagrant-cachier](https://github.com/fgrehm/vagrant-cachier)
 `vagrant plugin install vagrant-cachier`
- Install Ansible in your host machine. For OS X:
 `brew install ansible`
- Install [Virtualbox](https://www.virtualbox.org/wiki/Downloads) 5.1 or greater 

## Creating a new project

If you are starting a new project, see: [Setup.md](docs/Setup.md)


# Setting up an existing project locally

Find the IP-address and hostname that this local environment is configured to use from `conf/vagrant_local.yml` and add
it to your own `/etc/hosts` file:

`10.0.13.37 local.wundertools.com`

Let Vagrant create your new machine:

`vagrant up`

This will create a new Virtual machine on your computer, configure it with all the nice bells & whistles that you can
think of (like MariaDB, nginx, Varnish, memcached and whatnot) and start it up for you. This will also install vagrant plugin depedencies, if you encounter issues while installing the plugins then you could use: `vagrant --skip-dependency-manager up`

SSH into your box and build and install Drupal: 

```
vagrant ssh
cd /vagrant/drupal
./build.sh new
```

If this is a project with an existing production/staging server, you should probably sync the production database now,
from your local machine: 

`sync.sh`


##Introduction

Start by running:

```bash
$ vagrant up
```

This will do the following:

- clone the latest WunderMachina ansible/vagrant setup (or the version specified in conf/project.yml)
- Bring up & provision the virtual machine (if needed)
- Build the drupal site under drupal/current (not yet actually)

After finishing provisioning (first time is always slow) and building the site
you need to install the Drupal site in http://x.x.x.x:8080/install.php
(Note: on rare occasion php-fpm/varnish/e.g. requires to be restarted before
starting to work. You can do this by issuing the following command:

```bash
$ vagrant  ssh -c "sudo service php-fpm restart"
$ vagrant  ssh -c "sudo service varnish restart"
```


All Drupal-related configurations are under drupal/conf

Drush is usable without ssh access with the drush.sh script e.g:

```bash
$ ./drush.sh cc all
```

To open up ssh access to the virtual machine:

```bash
$ vagrant ssh
```

-------------------------------------------------------------------------------
Useful things

At the moment IP is configured in
  Vagrantfile
    variable INSTANCE_IP

Varnish responds to
  http://x.x.x.x/

Nginx responds to
  http://x.x.x.x:8080/

Solr responds to
  http://x.x.x.x:8983/solr

MailHOG responds to
  http://x.x.x.x:8025

Docs are in
        http://x.x.x.x:8080/index.html
        You can setup the dir where the docs are taken from and their URL from the
        variables.yml file.

        #Docs
        docs:
          hostname : 'docs.local.wundertools.com'
          dir : '/vagrant/docs'


##Vagrant + Ansible configuration

Vagrant is using Ansible provision stored under the ansible subdirectory.
The inventory file (which stores the hosts and their IP's) is located under
ansible/inventory. Host specific configurations for Vagrant are stored in
ansible/vagrant.yml and the playbooks are under ansible/playbook directory.
Variable overrides are defined in ansible/variables.yml.

You should only bother with the following:

  Vagrant box setup
    conf/vagrant.yml

  What components do you want to install?
    conf/vagrant.yml

  And how are those set up?
    conf/variables.yml

You can also fix your vagrant/ansible base setup to certain branch/revision
    conf/project.yml
  There you can also do the same for build.sh



## Debugging tools

XDebug tools are installed via the devtools role. Everything should work out
of the box for PHPStorm. PHP script e.g. drush debugging should also work.

Example Sublime Text project configuration (via Project->Edit Project):

    {
       "folders":
       [
         {
           "follow_symlinks": true,
           "path": "/path/to/wundertools"
         }
       ],

       "settings":
       {
         "xdebug": {
              "path_mapping": {
                    "/vagrant" : "/path/to/wundertools"
                 }
            }
          }
    }
