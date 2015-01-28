let pkgs = import <nixpkgs> {}; in
with pkgs;

{
  python34_nossl = python34.override {
    openssl = null;
  };

  python34_libressl = python34.override {
    openssl = libressl;
  };
}
