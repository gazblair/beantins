echo "$2  $1  ext4  defaults  0 0" | sudo tee -a /etc/fstab
sudo mkdir $1
sudo mount -a
chown vagrant:vagrant $1
chmod 777 $1
