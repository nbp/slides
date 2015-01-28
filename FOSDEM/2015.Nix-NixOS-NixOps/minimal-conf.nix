{
  services.openssh.enable = true;
  users.extraUsers.root.openssh.authorizedKeys.keyFiles = [
    /home/nicolas/.ssh/id.pub
  ];
}
