let pkgs = import <nixpkgs> {}; in
with pkgs;

{
  python35 = lib.overrideDerivation python34 (args: {
    src = /home/nicolas/cpython ;
  });
}
