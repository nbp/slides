{
  pres =
    { config, pkgs, ... }:

    { imports = [ ./modular-conf.nix ];
      deployment.targetEnv = "container";
      deployment.container.host = "jupiter.nbp.name";
    };
}
