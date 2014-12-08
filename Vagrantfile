# -*- mode: ruby -*-
# vi: set ft=ruby :

# Vagrantfile API/syntax version. Don't touch unless you know what you're doing!
VAGRANTFILE_API_VERSION = "2"

Vagrant.configure(VAGRANTFILE_API_VERSION) do |config|

  config.vm.box = "ubuntu/trusty64"


  config.vm.define "machine", primary: true do |machine|
      machine.vm.network "private_network", ip: "192.168.50.4"

      machine.vm.provision "ansible" do |ansible|
      ansible.playbook = "provisioning/playbook.yml"
      ansible.extra_vars = { ansible_ssh_user: "vagrant" }
      ansible.verbose = "vv"
      ansible.groups = {
        "app" => ["machine"]
      }
    end
  end
end
