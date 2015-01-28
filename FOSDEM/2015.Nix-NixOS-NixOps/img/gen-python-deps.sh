nix-store -q --graph /nix/store/l8rhnzq9yxqhv3il4kmzqhkx8q06jzgv-python-2.7.9/ | sed "s/#ff0000/#ffffff/" | dot -Tpng -opython-deps.png
