{ pkgs, config, ... }:

{
  imports = [
    ./minimal-conf.nix
  ];

  services.httpd = {
    enable = true;
    adminAddr = "a.a@a.a";
    documentRoot = ./. ;
  };
  networking.firewall.allowedTCPPorts = [ config.services.httpd.port ];
}
